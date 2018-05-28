const Eos = require('eosjs');
let {ecc} = Eos.modules;

const config = {
  httpEndpoint: 'http://10.3.1.136:8888',
  expireInSeconds: 60,
  broadcast: true,
  debug: false,
  sign: true
};

config.keyProvider = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';
eos = Eos.Testnet(config);

var account = eos.getAccount({"account_name":"eosio"});
account.then(res => {
  console.info(JSON.stringify(res));
});


console.info(JSON.stringify({
  account: "zrm",
  keys: {
    owner: ecc.privateToPublic(ecc.seedPrivate("zrm")),
    active: ecc.privateToPublic(ecc.seedPrivate("zrm"))
  },
}));
