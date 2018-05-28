const ecc = require('eosjs-ecc');
//const apiClient = require('./util/apiClient');
console.info(ecc);

const ownerKeys = {
  privateKey: ecc.randomKey()
};

ownerKeys.publicKey = ecc.privateToPublic(ownerKeys.privateKey);
const activeKeys = {
  privateKey: ecc.randomKey()
};
activeKeys.publicKey = ecc.privateToPublic(activeKeys.privateKey);

console.info(ownerKeys);
console.info(activeKeys);

const payload = {
  name: 'zzzz',
  keys: {
    active: activeKeys.publicKey,
    owner: ownerKeys.publicKey
  }
};

//apiClient.post("/v1/accounts/faucet", payload);

//await apiClient.post("/v1/accounts/faucet", payload);

