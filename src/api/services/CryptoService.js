const sicecc = require('sic-ecies');

function encrypt(message,eccPublic) {
  return sicecc().encrypt(message,eccPublic);
}

function decrypt(secretMessage,eccPrivate) {
  return sicecc().decrypt(secretMessage,eccPrivate);
}

module.exports = {
  eccService:{
    encrypt:encrypt,
    decrypt:decrypt
  }
}
