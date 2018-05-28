const { handler: errorHandler } = require('../middlewares/error');

const Eos = require('eosjs');
const { eosConfig } = require('../../config/eosconf');

const { aliOssClient } = require('../../config/alioss');
const { sic } = require('../../config/constant');


exports.loadPoliciesByAccount = async (req, res, next, accountPolicy) => {
  try {

    const account = 'sic.claim';
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


exports.loadReviewPoliciesByAccount = async (req, res, next, accountPolicy) => {
  try {

    const account = 'sic.claim';
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

    const account = 'sic.claim';
    const table = 'unapproved';
    const user = 'sic.claim';

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

