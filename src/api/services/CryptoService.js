const sicecc = require('sic-ecies');
var Eos = require('eosjs-ecc');

function encrypt(message,eccPublic) {
  return sicecc().encrypt(message,eccPublic);
}

function decrypt(secretMessage,eccPrivate) {
  return sicecc().decrypt(secretMessage,eccPrivate);
}

function seedPrivate(seed) {
    return Eos.modules.ecc.seedPrivate(seed);
}

function privateToPublic(priKey) {
    return Eos.modules.ecc.privateToPublic(priKey);
}

module.exports = {
  eccService:{
    encrypt:encrypt,
    decrypt:decrypt,
    seedPrivate:seedPrivate,
    privateToPublic:privateToPublic
  }
}
