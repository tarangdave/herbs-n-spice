const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const AWS = require('aws-sdk');
const fs = require('fs');
const utils = require('./StringUtils.js');

const ING_TABLE = process.env.ING_TABLE;

const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDb;
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  });
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
}

app.use(bodyParser.json({ strict: false }));

/**
 * This is a rest endpoint to fetch data from db using the
 * key passed in param.
 *
 * @param {string} key - user typed key param
 * @return {json} {key, value}
 */
app.get('/ingredient/:key', (req, res) => {
  const params = {
    TableName: ING_TABLE,
    Key: {
      ingKey: req.params.key,
    },
  };
  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get ingredient' });
    }
    if (result.Item) {
      const { key, value } = result.Item;
      res.json({ key, value });
    } else {
      res.status(404).json({ error: 'Ingredient not found' });
    }
  });
});

/**
 * This is a rest endpoint to add new ingredient data to db.
 *
 * @param {json} body - user sent body
 * @return {json} status messgae
 */
app.post('/new-ingredient', (req, res) => {
  const params = {
    TableName: ING_TABLE,
    Item: {
      ingKey: req.body.ingredient,
      value: { 'text': req.body.text, 'tags': req.body.tags }
    },
  };
  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create user' });
    }
    res.json({ 'success': 'status' });
  });
});


/**
 * This is a rest endpoint to fuzzy search data from db using the
 * key passed in param.
 *
 * @param {string} key - user typed key param
 * @return {json} {key, value}
 */
app.get('/fuzzy-search/:key', (req, res) => {
  const userKey = req.params.key;

  const params = {
    TableName: ING_TABLE,
    Key: {
      ingKey: userKey.toHashKey()
    },
  };
  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get ingredient' });
    }
    if (result.Item) {
      const { key, value } = result.Item;
      res.json({ key, value });
    } else {
      res.status(404).json({ error: 'Ingredient not found' });
    }
  });
});

/**
 * This is a rest endpoint to add all data from database.json into db.
 *
 * @return {json} status
 */
app.put('/add-ingredients', (req, res) => {
  fs.readFile(__dirname + '/database.json', (err, data) => {
    if (err) throw err;
    const ingredients = JSON.parse(data);
    let requestArray = [];
    Object.entries(ingredients).forEach(
        ([key, value]) => {
          requestArray.push(
              {
                PutRequest: {
                  Item: {
                    ingKey: key,
                    value
                  }
                }
              })
          if (requestArray.length % 10 === 0) {
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
            requestArray = [];
          }
        },
    );
    res.status(200).json({ 'status': 'success' });
  });
});

module.exports.handler = serverless(app);
