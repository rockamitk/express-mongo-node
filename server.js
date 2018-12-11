const mongoose=require('mongoose');
const express= require('express');
const morgan= require('morgan');
const bodyParser= require('body-parser');
const cookieParser= require('cookie-parser');
const compress= require('compression');
const methodOverride= require('method-override');
const cors= require('cors');
const httpStatus= require('http-status');
const expressValidation= require('express-validation');
const helmet= require('helmet');
const config= require('./config');
const APIError= require('./helpers/APIError');
const path= require('path');
const util=require('util');
const JWT = require('express-jwt');
const timeout = require('connect-timeout');
const fs = require('fs');
const moment = require('moment');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const routes= require('./routes');

const debug = require('debug')('express-mongoose-es6-rest-api:index');
Promise = require('bluebird');
mongoose.Promise = Promise;

const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
app.use(helmet());// secure apps by setting various HTTP headers
app.use(cors());// enable CORS - Cross Origin Resource Sharing
app.use(morgan(':method :url :status :response-time ms :res[content-length] kb'));
app.use(morgan('combined', {
    stream: fs.createWriteStream('../log/'+moment().format('YYYY-MM-DD')+"-success.log", {flags: 'a'})
}));
app.use(timeout(60000));
app.use((req, res, next)=>{
    if (!req.timedout) next();
});

/*
app.use(JWT({secret:config.jwtSecret}).unless({
    path: [
    ]})
);
*/

/*Generic error*/
app.use(function(err, req, res, next) {
    if(!res.finished){
        console.log("Generic error recieved at middleware");
        console.error(err);
        return res.status(err.status).json({status_code: err.status,  message: err.message});
    }
});


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});


// error handler, send stacktrace only during development
app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  })
);

//API URL
app.use('/api', routes);

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

/*
 SCALING APP i,e cloning using cluster module 
*/
if(cluster.isMaster && false) {//temporary
  console.log(`Master ${process.pid} is running`);
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
	// Workers can share any TCP connection
	// In this case it is an HTTP server
	// listen on port config.port
	app.listen(config.port, () => {
		console.info(`server started on port ${config.port} (${config.env})`);
	});
	console.log(`Worker ${process.pid} started`);
}

module.exports = app;