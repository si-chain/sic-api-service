const Eos = require('eosjs');
let {ecc} = Eos.modules;


/*p1 = ecc.seedPrivate('zrm');
p2 = ecc.seedPrivate('zrm');

console.info(p1);
console.info(p2);*/

const config = {
  httpEndpoint: 'http://10.3.1.136:8888',
  expireInSeconds: 60,
  broadcast: true,
  debug: false,
  sign: true
};

config.keyProvider = ['5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'];

eos = Eos.Testnet(config);
//console.info(eos);


/*eos.getInfo({}).then(res => {
  console.info(res);
});

eos.getBlock(1).then(res => {
  console.info(res);
});*/

initaPublic = 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV';
//eos.newaccount();
eos.getAccount();
eos.getAccount({"account_name":"eosio"}).then(res => {
  console.info(res);
});

eos.newaccount({
  creator: 'eosio',
  name: 'mynewacct',
  owner: initaPublic,
  active: initaPublic,
  recovery: 'eosio'
}).then(res => {
  console.info(res);
});



