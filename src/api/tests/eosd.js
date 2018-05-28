const Eos = require('eosjs');

const config = {
  keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3', // WIF string or array of keys..
  httpEndpoint: 'http://10.3.0.29:8888',
  expireInSeconds: 60,
  broadcast: true,
  debug: false,
  sign: true
};


eos = Eos.Testnet(config);

/*var result = eos.contract('sic.policy.hi').then(contract => {
  const info = {
    "producer":"inita",
    "value":"{   \"entity\":\"policy\",   \"type\":\"HI\",   \"version\":\"1.0.1\",   \"header\":{     \"HIP010001\":\"[保单号]\",     \"HIP010002\":\"[团单号]\",     \"HIP010003\":\"[保险公司]\",     \"HIP010004\":\"[被保人姓名-被保人证件号-被保人证件类型]\"   },   \"body\":{     \"policy\":{}   } }"
  };
  var res = contract.hipolicy('policyID',info,{scope:['sic.policy.hi','inita'],authorization:'inita@active'});
  console.info(res);
});*/

//eos.transfer('inita', 'initb', 1, 'test', true);

/*initaPublic = 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV';
eos.newaccount({
  creator: 'inita',
  name: 'mynewacct',
  owner: initaPublic,
  active: initaPublic,
  recovery: 'inita',
  deposit: '1 EOS'
});*/

/*eos.transaction({
  scope: ['inita', 'mynewacct'],
  messages: [
    {
      code: 'eos',
      type: 'transfer',
      authorization: [{
        account: 'inita',
        permission: 'active'
      }],
      data: {
        from: 'inita',
        to: 'mynewacct',
        amount: 1*10000,
        memo: 'create'
      }
    }
  ]
});*/

console.info(eos);
eos.getAccount({"account_name": "mynewacct"});
