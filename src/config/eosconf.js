const { eosd } = require('./vars');

module.exports = {
  eosConfig : {
    chainId: `${eosd.chainId}`,
    httpEndpoint: `${eosd.uri}`,
    expireInSeconds: 60,
    broadcast: true,
    debug: false,
    sign: true
  }
};


