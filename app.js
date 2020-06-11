var express = require('express');

let app = express();

var mongoUtils  = require('./libs/mongoUtils');

var config = require('./config/devConfig.json');

var processor = require('./api/batch/processor');

const hostname = '0.0.0.0', port = 3002;

require('./api/commons/express.js')(app);

require('./api/commons/routes.js')(app);

let dbInit = function(callback) {
    console.log("inside dbInit ---- >>>>:");
    let dbUrl = config.dbUrl;
    mongoUtils.createMongoConnection(dbUrl, {poolSize : 5, useUnifiedTopology: true}, function(err, dbConn) {
        if(err){
            console.log("inside mongo error",err);
            return callback(err);
        }else{
            console.log("inside Db success ---- >>>>:");
            pmDB = dbConn.db;
            callback({success: true});    
        }
    })
}

let env = process.env.NODE_ENV || 'development';
config.env = env;

console.log("config is ", config);
app.listen(port, () => {
    console.log("Listening on port 3000", env);
    dbInit(function(dbRes){
        console.log("db connection success", dbRes);
        setInterval(function() {
            //schedular will run every 2 mins
            console.log("initiate batch job");
            processor.processBatchRequests();
        },120000);
    });
});