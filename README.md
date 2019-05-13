# herbs-n-spice

+ ``` git clone https://github.com/tarangdave/herbs-n-spice.git```
+ ``` cd herbs-n-spice```

### Installation - Server

+ ``` npm install -g serverless ```
+ ``` npm install ```
+ ``` sls dynamodb install ```

### Installation - Client

+ ``` cd frontend ```
+ ``` npm install ```

### Running Server

+ ``` cd herbs-n-spice ```
+ ``` serverless config credentials --provider aws --key "accesskey" --secret "secretkey" ```
+ ``` sls offline start ```
+ Server will be running at port 3000
+ Dynamodb will be running at port 8000. You can access the console using ``` http://localhost:8000/shell/ ```

### Running Client

+ ``` cd herbs-n-spice ```
+ ``` cd frontend ```
+ ``` npm start ```
+ Client will start on port 3001

### Interacting with API using cURL

+ Index database.json data into dynamodb - ``` curl -H "Content-Type: application/json" -X PUT http://localhost:3000/add-ingredients ```


+ npm install --save express serverless-http
+ npm install --save-dev serverless-offline
+ npm install -g serverless
+ npm install --save-dev serverless-dynamodb-local
+ sls dynamodb install
+ sls offline start
+ serverless config credentials --provider aws --key "accesskey" --secret "secretkey"