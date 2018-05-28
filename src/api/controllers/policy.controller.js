const httpStatus = require('http-status');
const { omit } = require('lodash');
const aqp = require('api-query-params');
const Action = require('../models/action.model');
const { handler: errorHandler } = require('../middlewares/error');

const Eos = require('eosjs');
const { eosConfig } = require('../../config/eosconf');
const { aliOssClient } = require('../../config/alioss');
const eosService = require('../services/eos.service');
const { sic } = require('../../config/constant');

/**
 * Load
 * @public
 */
exports.loadPolicesByKey = async (req, res, next) => {
  try {
    const query = aqp(req.query);
    let searchKey = req.query.searchKey;

    let page = req.query.page;
    let pageNum = req.query.pageNum;

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
      'filter':{
        'handler_account_name':'sic.policy',
        'name':'approved',
        'action_id':0,
        '$or':[
            {'data.ID':searchKey},
            {'data.policyID':searchKey},
            {'data.account':searchKey},
            {'data.type':searchKey},
            {'data.param1':searchKey},
            {'data.param2':searchKey},
            {'data.param3':searchKey},
            {'data.param4':searchKey},
            {'data.param5':searchKey},
          ]
      }
    };

    let json = {};
    json.success = true;
    json.code = 200;

    if(searchKey){
      console.info(JSON.stringify(condition));
      let count = await Action.where(condition.filter).count();//记录总数
      if(count > 0){

        let pageCount = Math.ceil(count / pageNum);//总页数
        if(pageCount >= page){
          let skip = (page-1)*pageNum;
          let limit = skip+pageNum;

          condition.skip = skip;
          condition.limit = limit;
          condition.projection = {'_id':0};
          console.info(JSON.stringify(condition));
          //let filter = {"$and":[{"handler_account_name":"sic.policy"},{"name":"approved"}]};
          let records = await Action.list(condition);

          json.data = {
            count:count,
            page:page,
            pageNum:pageNum,
            pageCount:pageCount,
            records:records
          };
        }else{
          console.info("页码超过总页数")
        }
      }else{
        console.info("未查到记录")
      }
    }

    res.json(json);
    /*req.locals = { accounts };
    return next();*/
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

const creatorPrivateKey = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';

let eosdConf = eosConfig;
eosdConf.keyProvider = creatorPrivateKey;

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.rewards = async (req, res, next) => {
  /*reward(req.params.user,'托管保单'+req.params.applyId+'所得奖励');
  reward(req.params.auditor,'审核保单'+req.params.applyId+'所得奖励');*/
  let applyId = req.params.applyId;
  let user    = req.params.user;
  let auditor = req.params.auditor;
  //console.info(eosService);
  let policy = await eosService.getPolicyByAccountAndApplyId(user,applyId);

  let json = {success:false,code:400};

  if(policy){
    if(policy.status === sic.contract.policy.status.approved){
      if(auditor === policy.reviewer){
        let reward = await eosService.getRewardByApplyId(applyId);
        if(!reward){
          let id = await eosService.submitTrustPolicyReward(user,applyId,auditor);
          if(id){
            console.info(id);
            json.success = true;
            json.code = 200;
          }else{
            json.message = 'submit error,please try again later!';
          }
        }else{
          json.message = 'The apply had submit a reward,waiting pls';
        }
      }else{
        json.message = 'This auditor is not '+auditor;
      }
    }else{
      json.message = 'This apply is not approved!';
    }
  }else{
    json.message = 'Not found!';
  }
  res.json(json);
};



exports.loadPoliciesByAccount = async (req, res, next, accountPolicy) => {
  try {

    const account = 'sic.policy';
    const table = 'policy';
    const user = accountPolicy;

    let lowerBound = req.query.lowerBound;
    if(!lowerBound){
      lowerBound = 0;
    }

    let limit = req.query.limit;
    if(!limit){
      limit = 10;
    }


    let eos = Eos.Localnet(eosConfig);
    eos.getTableRows({
      code:account,
      table:table,
      json:true,
      scope:user,
      lower_bound:lowerBound,
      limit:limit
    }).then(accountPolicies => {
      //console.info(res);
      req.locals = {accountPolicies};
      return next();
    });
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @param account
 * @param applyId
 * @returns {Promise<*>}
 */
exports.getAccountPolicyByApplyId = async (req, res, next) => {
  try {

    const code = sic.contract.policy.code;
    const table = sic.contract.policy.table.policy;
    const user  = req.params.account;
    const applyId = req.params.applyId;

    let eos = Eos.Localnet(eosConfig);
    //Eos.modules.format.encodeName();
    eos.getTableRows({
      code:code,
      table:table,
      json:true,
      scope:user,
      lower_bound:applyId,
      limit:1
    }).then(db => {
      let json = {};
      json.success = true;
      json.code = 200;
      if(db.rows.length > 0){
        json.data = db.rows[0];
      }else{
        json.data = {};
      }


      res.json(json);
      res.status(200);
    });
  } catch (error) {
    return next(error);
  }
};


exports.loadReviewPoliciesByAccount = async (req, res, next, accountPolicy) => {
  try {

    const account = 'sic.policy';
    const table = 'reviewlist';
    const user = accountPolicy;

    let lowerBound = req.query.lowerBound;
    if(!lowerBound){
      lowerBound = 0;
    }

    let limit = req.query.limit;
    if(!limit){
      limit = 10;
    }


    let eos = Eos.Localnet(eosConfig);
    eos.getTableRows({
      code:account,
      table:table,
      json:true,
      scope:user,
      lower_bound:lowerBound,
      limit:limit
    }).then(reviewList => {
      //console.info(reviewList);
      let list = reviewList.rows;
      if(list){
        for(i in list){
          let apply = list[i];
          //console.info(apply.ID);
          let ossAddr = JSON.parse(apply.ossAddr);
          let files = ossAddr.files;
          if(files && files.length > 0){
            for(j in files){
              let file = files[j];
              file.url = aliOssClient.signatureUrl(file.path,{expires: sic.file.auth.expires});//auth an hour
              //console.info(aliOssClient.signatureUrl(file.path,{expires: 1800}));
            }
          }
          delete apply.ossAddr;
          apply.files = files;
        }
      }

      req.locals = {reviewList};
      return next();
    });
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.unapprovePolicyList = async (req, res, next) => {
  try {

    let lowerBound = req.query.lowerBound;
    if(!lowerBound){
      lowerBound = 0;
    }

    let limit = req.query.limit;
    if(!limit){
      limit = 10;
    }

    const account = 'sic.policy';
    const table = 'unapproved';
    const user = 'sic.policy';

    let eos = Eos.Localnet(eosConfig);
    eos.getTableRows({
      code:account,
      table:table,
      json:true,
      scope:user,
      lower_bound:lowerBound,
      limit:limit
    }).then(data => {
      //console.info(res);
      let json = {};
      json.success = true;
      json.code = 200;

      json.data = data;
      res.json(json);
      res.status(200);
    });

  } catch (error) {
    errorHandler(error,req,res);
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
    console.info("================="+JSON.stringify(req.body));
    //res.json(req.transform());
  } catch (error) {
    next();
  }

  try {
    let account = "inita";
    eosConfig.keyProvider = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';

    let eos = Eos.Testnet(eosConfig);
    eos.contract('sic.policy.hi').then(contract => {
      //console.info(contract);
      const info = {
        "producer":account,
        "value":JSON.stringify(req.body)
      };
      let result = contract.hipolicy('policyID',info,{scope:['sic.policy.hi',account],authorization:account+'@active'});
      result.then(result =>{
        let json = {};
        json.success = true;
        json.code = 200;
        json.data = result;
        res.json(json);
        res.status(200);
      });
    });
  } catch (error) {
    next(error);
  }
};


exports.getPolicyByAccount = async (req, res, next) => {
  try {

    //req.body.params.limit;
    let accountPolicies = req.locals.accountPolicies;

    let json = {};
    if(accountPolicies){
      json.success = true;
      json.code = 200;
      json.data = accountPolicies;
    }else{
      json.success = false;
      json.code = 400;
    }

    res.json(json);
    res.status(200);

  } catch (error) {
    next(error);
  }
};

exports.getReviewPolicyByAccount = async (req, res, next) => {
  try {

    //req.body.params.limit;
    let reviewList = req.locals.reviewList;

    let json = {};
    if(reviewList){
      json.success = true;
      json.code = 200;
      json.data = reviewList;
    }else{
      json.success = false;
      json.code = 400;
    }

    res.json(json);
    res.status(200);

  } catch (error) {
    next(error);
  }
};

