const mongoose = require('mongoose');
const { mongo, env } = require('./vars');

// print mongoose logs in dev env
if (env === 'dev') {
  mongoose.set('debug', true);
}


let db2 = mongoose.createConnection(mongo.uri2, {keepAlive: 1, useMongoClient: true,});
db2.on('error', console.error.bind(console, '... db2 connect error ...'));
db2.once('open', function callback() {
  console.info(`DB2 connecting to mongo @: ${mongo.uri2}`);
});

module.exports = db2;
