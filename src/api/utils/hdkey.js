const bip39 = require('bip39');
const hdkey = require('ethereumjs-wallet/hdkey');

exports.getEthWallet = (str) => {
  var mnemonic = 'swap cook link special critic across wealth evidence green olympic capable jacket';
  var seed = bip39.mnemonicToSeed(mnemonic);
  var hdWallet = hdkey.fromMasterSeed(seed);
  var path = "m/44'/60'/0'/0";
  for (var i = 0, len = str.length; i < len; i++ ) {
    if (i%5==0) index+='/';
    n = str[i].charCodeAt();
    n -= n < 0x3a ? 0x2e : 0x55;
    index += n;
  }
  return hdWallet.derivePath(path)
}
