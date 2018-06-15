const aqp = require('api-query-params');
const { handler: errorHandler } = require('../middlewares/error');
const { eosd,sicAccount } = require('../../config/vars');
const { sic } = require('../../config/constant');
const Account = require('../models/account.model');
const Action = require('../models/action.model');
const Transaction = require('../models/transaction.model');
const eosService = require('../services/eos.service');
const configService = require('../services/ConfigService');


exports.loadChainInfo = async (req, res, next, chain_name) => {
  try {
    const isEos = chain_name === 'eos' ? true : false;
    req.locals = {isEos};
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};


exports.loadAccount = async (req, res, next,account_name) => {
  try {
    //console.info("========loadAccount========="+account_name);
    if(req.locals.isEos){
      let account;
      try {
          account = await eosService.getEosd().getAccount(account_name);
      }catch (error){

      }

      if(account){

        let getAccountInfo = eosService.getAccountInfo(account_name);

        let getToken = eosService.getTable({
          code:sic.contract.token.code,
          table:sic.contract.token.table.account,
          scope:account_name,
          json:true,
          limit:1
        });

        Promise.all([getAccountInfo,getToken]).then(([info,data]) => {
          if(data.rows.length > 0){
            account ['balance'] = data.rows[0].balance;
            account ['eos_balance'] = data.rows[0].balance;
          }else{
            account ['balance'] = "0.0000 SIC";
            account ['eos_balance'] = "0.0000 SIC";
          }

          account.mobile = null;
          account.email = null;
          if(info){
            account.mobile = info.phone;
            account.email = info.email;
          }
          req.locals = {account};
          next();
        });
      }else{
        next();
      }
    }
  } catch (error) {
    return errorHandler(error, req, res);
  }
};



/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.trust = async (req, res, next) => {
  try {
    // console.info("================="+JSON.stringify(req.body));
    res.json(req.transform());
  } catch (error) {
    next();
  }
};


exports.faucet = async (req, res, next) => {

  const { chainName } = req.body;

  //let account = JSON.stringify(req.body);
  //console.debug("body:"+account);

  if(chainName === 'eos'){
    // eosAccountService.createDawnAccount(req,res,next);


    const { accountName, inviteCode, keys } = req.body;
    let isNeedInvited = configService.getValByKey('KEY_IS_NEED_INVITE_CODE');

    const creator = sicAccount.account.creator.name;
    const creatorPrivateKey = sicAccount.account.creator.priKey;

    let opt = {
        creator: {
          name: creator,
          active: creatorPrivateKey,
        },
        name: accountName,
        owner: keys.owner,
        active: keys.active,
    };

    let json = {};
    json.success = false;
    json.code = 500;
    try{
      let data = await eosService.newAccount(opt);
      json.success = true;
      json.code = 200;
      delete data.transaction;
      delete data.broadcast;
      json.data = data;
    }catch (error){
      console.error(error);
      json = JSON.parse(error);
    }
    res.status(200);
    res.json(json);
  }else if(chainName === 'eth'){

  }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.get = (req, res) => {
  let json = {};
  json.success = false;
  let account = req.locals.account;
  if(account && account.permissions.length > 0){
    json.data = req.locals.account;
    json.success = true;
    json.code = 200;
  }else{
    json.code = 400;//未找到账户
    json.message = "account name not fond!"
  }
  res.json(json);
};

/*exports.getAccountByKey = async (req, res, next) => {
  try {
    const query = aqp(req.query);
    const accounts = await Account.list(query);
    const transformedAccounts = accounts.map(acct => acct.transform());
    res.json(transformedAccounts);
  } catch (error) {
    next(error);
  }
};*/


exports.accounts = async (req, res, next) => {
  try {
    const query = aqp(req.query);
    const accounts = await Account.list(query);
    const transformedAccounts = accounts.map(acct => acct.transform());
    res.json(transformedAccounts);
  } catch (error) {
    next(error);
  }
};

/****************************************Transaction***********************************************/

/**
 * Load Transaction and append to req.
 * @public
 */
exports.loadTransaction = async (req, res, next, txnId) => {
  try {
    const txn = await Transaction.get(txnId);
    req.locals = { txn };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get Transaction list
 * @public
 */
exports.getTransaction = async (req, res, next) => {
  try {
    const query = aqp(req.query);
    if (req.locals && req.locals.block) {
      query.filter = {
        ...query.filter,
        block_id: req.locals.block.block_id,
      };
    }
    const txns = await Transaction.list(query);
    let json = {};
    json.success = true;
    json.code = 200;
    json.data = txns;
    res.json(json);
  } catch (error) {
    next(error);
  }
};

exports.createTransaction = async (req, res, next) => {
  try {
    // const { resp, json } = await postTransaction(req.body);
    console.log(`--> fetching ${eosd.uri}/v1/chain/push_transaction`);
    console.log('--> body:', JSON.stringify(req.body, null, 2));
    const resp = await fetch(`${eosd.uri}/v1/chain/push_transaction`, {
      method: 'POST',
      body: JSON.stringify(req.body),
    });
    let json;
    if (resp.headers.get('content-type').indexOf('json') > -1) {
      const text = await resp.text();
      json = JSON.parse(text);
    } else {
      json = await resp.json();
    }
    res.status(resp.status);
    res.json(json);
  } catch (error) {
    next(error);
  }
};


exports.getActionsByAccount = async (req, res) => {
  let page = req.query.page;
  let pageNum = req.query.pageNum;
  let account = req.params.tranAccountName;

  if(!page || page < 1){
    page = 1;
  }else{
    page = parseInt(page);
  }

  if(!pageNum || pageNum < 1){
    pageNum = 100;
  }else{
    pageNum = parseInt(pageNum);
  }


  let condition ={
    "filter":{
      "handler_account_name":"sic.token",
      "name":"transfer",
      'action_id':0,
      '$or':[
        {'data.from':account},
        {'data.to':account}
      ]
    }
  };

  let json = {};
  json.success = true;
  json.code = 200;

  //console.info(JSON.stringify(condition));
  let count = await Action.where(condition.filter).count();//记录总数
  if(count > 0) {

    let pageCount = Math.ceil(count / pageNum);//总页数
    if (pageCount >= page) {
      let skip = (page - 1) * pageNum;
      let limit = skip + pageNum;

      condition.skip = skip;
      condition.limit = limit;
      condition.projection = {'_id': 0};
      console.info(JSON.stringify(condition));
      //let filter = {"$and":[{"handler_account_name":"sic.policy"},{"name":"approved"}]};
      let records = await Action.list(condition);

      let arr = [];
      for(i in records){
        let item = records[i];
        arr.push({
          transaction_id:item['transaction_id'],
          from:item.data.from,
          to:item.data.to,
          quantity:item.data.quantity,
          memo:item.data.memo
        });
      }

      json.data = {
        count: count,
        page: page,
        pageNum: pageNum,
        pageCount: pageCount,
        records: arr
      };
    } else {
      console.info("页码超过总页数")
    }
  }
  res.json(json);
};


