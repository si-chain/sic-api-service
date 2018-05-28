const httpStatus = require('http-status');
const { omit } = require('lodash');
const aqp = require('api-query-params');
const User = require('../models/user.model');
const { handler: errorHandler } = require('../middlewares/error');
const { eosd } = require('../../config/vars');

const Eos = require('eosjs');
const { eosConfig } = require('../../config/eosconf');

const { aliOssClient } = require('../../config/alioss');



/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.getAuditors = async (req, res, next) => {
  try {

    let lowerBound = req.query.lowerBound;
    if(!lowerBound){
      lowerBound = 0;
    }

    let limit = req.query.limit;
    if(!limit){
      limit = 100;
    }

    const account = 'sic.role';
    const table = 'rolelist';
    const user = 'sic.role';

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

      let auditors = [];
      if(data.rows.length > 0){
        for(i in data.rows){
          let account = data.rows[i];
          if(account['role_type'] === 1){
            auditors.push({auditor:account.role});
          }
        }
      }

      data.rows = auditors;

      json.data = data;
      res.json(json);
      res.status(200);
    });

  } catch (error) {
    errorHandler(error,req,res);
  }
};



exports.getMches = async (req, res, next) => {
  try {

    let lowerBound = req.query.lowerBound;
    if(!lowerBound){
      lowerBound = 0;
    }

    let limit = req.query.limit;
    if(!limit){
      limit = 100;
    }

    const account = 'sic.role';
    const table = 'rolelist';
    const user = 'sic.role';

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

      let auditors = [];
      if(data.rows.length > 0){
        for(i in data.rows){
          let account = data.rows[i];
          if(account['role_type'] === 2){
            auditors.push({account:account.role});
          }
        }
      }

      data.rows = auditors;

      json.data = data;
      res.json(json);
      res.status(200);
    });

  } catch (error) {
    errorHandler(error,req,res);
  }
};



exports.getAdmins = async (req, res, next) => {
  try {

    let lowerBound = req.query.lowerBound;
    if(!lowerBound){
      lowerBound = 0;
    }

    let limit = req.query.limit;
    if(!limit){
      limit = 10;
    }

    const account = 'sic.role';
    const table = 'adminlist';
    const user = 'sic.role';

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

      /*if(data.rows.length == 0){
        data.rows = [];
      }*/

      json.data = data;
      res.json(json);
      res.status(200);
    });

  } catch (error) {
    errorHandler(error,req,res);
  }
};



