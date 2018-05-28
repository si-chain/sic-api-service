const { handler: errorHandler } = require('../middlewares/error');

const Eos = require('eosjs');
const { eosConfig } = require('../../config/eosconf');
const { smsService } = require('../services/SmsService');


exports.loadMessagesByAccount = async (req, res, next, accountName) => {
  try {

    const account = 'sic.auth';
    const table = 'authlist';
    const user = accountName;

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
    }).then(response => {
      let rows = [];
      if(response.rows.length > 0){
        for(i in response.rows){
          let auth = response.rows[i];
          let msg = {};
          msg.id = auth.authID;
          msg.type = auth.type;
          msg.status = auth.status;

          if(msg.type === 1){
            msg.msg = "期望查看您的保单信息";
            msg.reward = "1.0000 SIC";
          }else if(msg.type === 2){
            msg.msg = "期望查看您的理赔信息";
            msg.reward = "2.0000 SIC";
          }else{
            msg.msg = "未知的授权类型";
            msg.reward = "0.5000 SIC";
          }

          msg.applicant = auth.requester;
          msg.dt = auth.req_time;
          msg.reqKey = auth.req_pubkey;
          msg.authValue = auth.auth_value;
          rows.push(msg);
        }
      }

      let messages = {rows:rows,more:response.more};
      req.locals = {messages};
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
exports.getUserMessages = async (req, res, next) => {
  try {

    let json = {};
    json.success = true;
    json.code = 200;

    json.data = req.locals.messages;
    res.json(json);
    res.status(200);

  } catch (error) {
    errorHandler(error,req,res);
  }
};

exports.getUserMessage = async (req, res, next) => {
  try {

    const account = 'sic.auth';
    const table = 'authlist';
    //accountName/:applyId
    const user = req.params.userAccount;
    const authId = req.params.authId;

    let eos = Eos.Localnet(eosConfig);


    eos.getTableRows({
      code:account,
      table:table,
      json:true,
      scope:user,
      lower_bound:authId,
      limit:1
    }).then(response => {
      let data = {};
      if (response.rows.length > 0) {
        data = response.rows[0];
      }

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

exports.getMchMessages = async (req, res, next) => {
  try {
    let mchAccount = req.params.mchAccount;

    let json = {};
    json.success = true;
    json.code = 200;

    const account = 'sic.auth';
    const table = 'authstatus';

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
      scope:mchAccount,
      lower_bound:lowerBound,
      limit:limit
    }).then(response => {
      json.data = response;
      res.json(json);
      res.status(200);
    }).catch(e =>{
      res.json(json);
      res.status(200);
    });
  } catch (error) {
    errorHandler(error,req,res);
  };
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.getSmsCode = async (req, res, next) => {
  try {
    let json = {
      success : false,
      code : 500
    };

    let {mobile,country,captcha} = req.body;

    try{
      json = await smsService.sendVerifyMobileCode(mobile,country);
    }catch (err){
      console.error(err);
    }

    res.json(json);
    res.status(200);
  } catch (error) {
    errorHandler(error,req,res);
  };
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.verifySmsCode = async (req, res, next) => {
  try {
    let json = {
      success : false,
      code : 500
    };

    let {account,mobile,code,country} = req.body;

    let flag = await smsService.verifyMobileCode(account,mobile,code,country);
    if(flag.success){
      //json.data = res;
      json.success = true;
      json.code = 200;
    }else{
      json.code = flag.code;
      json.message = flag.message;
    }

    res.json(json);
    res.status(200);
  } catch (error) {
    errorHandler(error,req,res);
  };
};


