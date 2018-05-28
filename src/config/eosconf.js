const Eos = require('eosjs') // Eos = require('./src')
const { eosd } = require('./vars');

module.exports = {
  eosConfig : {
    httpEndpoint: `${eosd.uri}`,
    expireInSeconds: 60,
    broadcast: true,
    debug: false,
    sign: true
  }
};


