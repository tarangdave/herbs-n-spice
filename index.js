const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');
var fs = require('fs');
const utils = require('./StringUtils.js');

const ING_TABLE = process.env.ING_TABLE;

const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDb;
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  })
  console.log(dynamoDb);
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
};

app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
    res.send('Hello World!')
  })
  
  // Get key ingredient endpoint for search
  app.get('/ingredient/:key', function (req, res) {
    const params = {
      TableName: 'ing-table-dev',
      Key: {
        ingKey: req.params.key
      },
    }
    dynamoDb.get(params, (error, result) => {
      if (error) {
        console.log(error);
        res.status(400).json({ error: 'Could not get ingredient' });
      }
      if (result.Item) {
        const {key, value} = result.Item;
        res.json({ key, value });
      } else {
        res.status(404).json({ error: "Ingredient not found" });
      }
    });
  })

app.post('/new-ingredient', function(req, res){
  console.log(req.body)
  const params = {
    TableName: ING_TABLE,
    Item: {
      ingKey: req.body.ingredient,
      value: {"text": req.body.text, "tags": req.body.tags}
    },
  };
  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create user' });
    }
    res.json({"success": "status"});
  });
})

app.get('/fuzzy-search/:key', function(req, res) {
  userKey = req.params.key;
  // console.log(userKey.toHashKey().getVariations())

  const params = {
    TableName: 'ing-table-dev',
    Key: {
      ingKey: userKey.toHashKey()
    },
  }
  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get ingredient' });
    }
    if (result.Item) {
      const {key, value} = result.Item;
      res.json({ key, value });
    } else {
      res.status(404).json({ error: "Ingredient not found" });
    }
  });
})
  

  // create add-ingredients endpoint to read and index file into db
  app.post('/add-ingredients', function(req, res) {
    fs.readFile('database.json', (err, data) => {  
        if (err) throw err;
        let ingredients = JSON.parse(data);
        // TODO: add the contents of file to db
        var requestArray = []
        Object.entries(ingredients).forEach(
            ([key, value]) => {
                console.log(value)
                requestArray.push(
                  {
                      PutRequest: {
                        Item: {
                          ingKey: key,
                          value
                        }
                      }
                  })
                if(requestArray.length%10==0){
                    let params = {
                      RequestItems: {
                        'ing-table-dev': requestArray
                      }
                    }
                    dynamoDb.batchWrite(params, (error) => {
                      if (error) {
                        console.log(error);
                        res.status(400).json({ error: 'Could not create ingredent' });
                      }
                    });
                    requestArray = []
                  }
            },
        );
        res.status(200).json({"status": "success"})
    });
  })
  
  module.exports.handler = serverless(app);