# herbs-n-spice

+ ``` git clone https://github.com/tarangdave/herbs-n-spice.git```
+ ``` cd herbs-n-spice```

### Installation - Server (LINUX environment)

+ ``` npm install -g serverless ```
+ ``` npm install ```
+ ``` sls dynamodb install ```

### Running Server (LINUX environment)

+ ``` cd herbs-n-spice ```
+ ``` serverless config credentials --provider aws --key "accesskey" --secret "secretkey" ```
+ ``` sls offline start ```
+ Server will be running at port 3000
+ Dynamodb will be running at port 8000. You can access the console using ``` http://localhost:8000/shell/ ```
+ Populating the db, run ``` curl -H "Content-Type: application/json" -X PUT http://localhost:3000/add-ingredients ```

### Installation - Client (LINUX environment)

+ ``` cd frontend ```
+ ``` npm install ```

### Running Client (LINUX environment)

+ ``` cd herbs-n-spice ```
+ ``` cd frontend ```
+ ``` npm start ```
+ Client will start on port 3001
+ Visit ``` http://localhost:3001/ ``` to interact with the webapp

### Interacting with API using cURL

+ Index database.json data into dynamodb by running - ``` curl -H "Content-Type: application/json" -X PUT http://localhost:3000/add-ingredients ```
+ Search for a specific key ingredient run - ``` curl -H "Content-Type: application/json" -X GET http://localhost:3000/ingredient/surf ```
+ Add your own ingredient run - ``` curl -H "Content-Type: application/json" -X POST --data '{"ingredient":"test","text":"test text","tags":{"a":1,"b":1}}' http://localhost:3000/new-ingredient ```
