const mongoose = require('mongoose');
const { mongo, env } = require('./vars');

// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// print mongoose logs in dev env
if (env === 'dev') {
  mongoose.set('debug', true);
}

/**
* Connect to mongo db
*
* @returns {object} Mongoose connection
* @public
*/
exports.connect = () => {
  console.log(`Connecting to mongo @: ${mongo.uri}`);
  mongoose.connect(mongo.uri, {
    keepAlive: 1,
    useMongoClient: true,
  });
  return mongoose.connection;
};

exports.disconnect = () => {
  mongoose.disconnect(()=>{
    console.log(`disconnect : ${mongo.uri}`);
  });
}
