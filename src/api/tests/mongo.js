const Action = require('../models/Action.model');
const mongoose = require('../../config/mongoose');

const searchKey = 'param1';
let condition ={
  "filter":{
    "handler_account_name":"sic.policy",
    "name":"approved",
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

async function load() {
  mongoose.connect();
  console.log('[test db] Loading ...');
  let count = await Action.where(condition.filter).count();
  console.info(count);
  console.info(Math.ceil(count / 15));



  let page = 1;
  let pageNum = 5;

  let skip = (page-1)*pageNum;
  let limit = skip+pageNum;






}

load();

