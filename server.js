const mongoose=require('mongoose');

/*Low db configuration*/
// const low = require('lowdb');
// const FileSync = require('lowdb/adapters/FileSync')
// const adapter = new FileSync('./data/db.json');
// let lowdb = low(adapter);

const util=require('util');


// config should be imported before importing any other file
let config = require('./config/config');
let app = require('./config/express');

const debug = require('debug')('express-mongoose-es6-rest-api:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = `mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.db}`;
console.log("DB URL: "+mongoUri);

mongoose.connect(mongoUri, {keepAlive: 1,
  useMongoClient: true}, function(){
	console.log("Mongo db has connected.");
});

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// listen on port config.port
app.listen(config.port, () => {
	console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
});

module.exports = app;