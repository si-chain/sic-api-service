const Eos = require('eosjs');
const { eosConfig } = require('../../config/eosconf');
const { sic } = require('../../config/constant');
const { sicAccount } = require('../../config/vars');
const { eccService } = require('./CryptoService');

const Reward = require('../models/Reward.model');
const Deposit = require('../models/Deposit.model');

/**
 *
 * @param key
 * @returns {*}
 */
function getEosd(key){
  if(key != undefined){
    eosConfig.keyProvider = key;
  }
  return Eos.Testnet(eosConfig);
}

/**
 *
 * @param contractCode
 * @param key
 * @returns {*|{policy, token, account}}
 */
function getContract(contractCode,key) {
  return getEosd(key).contract(contractCode)
}

/**
 *
 * @param opt
 * @returns {Promise<*>}
 */
async function getTable(opt) {
  let eosd = getEosd();
  let data = await eosd.getTableRows({
    code:opt.code,
    table:opt.table,
    json:opt.json,
    scope:opt.scope,
    lower_bound:opt.lower_bound,
    upper_bound:opt.upper_bound,
    table_key:opt.table_key,
    limit:opt.limit
  });
  return data;
}

/**
 *
 * @param account user's account name
 * @param applyId user's applyId
 * @returns {Promise<void>} return null when it's not exits;
 */
async function getPolicyByAccountAndApplyId(account,applyId){
  let data = await getTable({
    code:sic.contract.policy.code,
    table:sic.contract.policy.tables.policy,
    json:true,
    scope:account,
    lower_bound:applyId,
    //upper_bound:'1526435522476',
    table_key:'',
    limit:1
  });

  let policy = null;
  if(data.rows.length === 1){
    policy = data.rows[0];
  }

  return policy;
}

/**
 *
 * @param user
 * @param applyId
 * @param auditor
 * @returns {Promise<*>}
 */
async function submitTrustPolicyReward(user,applyId,auditor){
  let result = {_id:null};
  let dbData = await getRewardByApplyId(applyId);
  if(!dbData){
    let option = {
      applyId: applyId,
      type: 1,
      user: {
        account:user,
        reward:'2.0000 SIC',
        status:0
      },
      auditor: {
        account:auditor,
        reward:'2.0000 SIC',
        status:0
      }
    };
    result = await Reward.submitReward(option);
  }
  return  result._id;
}

async function submitDeposit(transactionId,users){
  let result = 0;
  let dbData = await getDepositByTranId(transactionId);
  if(!dbData && users.length>0){
    for(i in users){
      let user = users[i];
      let obj = await Deposit.submitDeposit(user);
      if(obj._id){
        result ++;
      }
    }
  }
  return  result;
}

/**
 *
 * @param applyId
 * @returns {Promise}
 */
function getRewardByApplyId(applyId){
  return Reward.findOne({applyId:applyId}).exec();
}

/**
 *
 * @param tranId
 * @returns {Promise}
 */
function getDepositByTranId(transactionId){
  return Deposit.findOne({transaction_id:transactionId}).exec();
}

async function getTranById(transactionId){
  let eosd = getEosd();
  //eosd.getTransaction();
  return await eosd.getTransaction({transaction_id:transactionId});
}

/**
 *
 * @param account
 * @returns {Promise<*>}
 */
async function getAccountInfo(account) {
  let data = null;
  try{
    data = await getTable({
      code:sic.contract.account.code,
      table:sic.contract.account.table.accountinfo,
      json:true,
      scope:account,
      lower_bound:'',
      upper_bound:'',
      table_key:'',
      limit:1
    });
  }catch (error){
    console.error(error);
  }

  let accountInfo = null;
  if(data != null && data.rows.length > 0){
    accountInfo = data.rows[0];
  }
  return accountInfo;
}

/**
 *
 * @param option
 * @returns {Promise<void>}
 */
async function setAccountMobile(name,mobile,country = 86) {

  let phone = mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');

  //let k = eccService.decrypt(m,sicAccount.sicCommPriKey);
  //console.info(k);

  let accountInfo = await getAccountInfo(name);
  let email = '';
  if(accountInfo != null){
    try{
      let obj = JSON.parse(eccService.decrypt(accountInfo.value,sicAccount.sicCommPriKey));
      email = obj.email;
    }catch (error){

    }
  }

  let option = {};
  option.name = name;
  option.phone = phone;
  let valStr = JSON.stringify({
    version:sic.version,
    country:country,
    phone:mobile,
    email:email
  });

  option.value = eccService.encrypt(valStr,sicAccount.sicCommPubKey);

  let code = sic.contract.account.code;
  let contract = await getContract(code,sicAccount.account.actPriKey);
  return contract.setphone(option,{authorization:code});
}



module.exports = {
  getEosd:getEosd,
  getTable:getTable,
  getPolicyByAccountAndApplyId:getPolicyByAccountAndApplyId,
  submitTrustPolicyReward:submitTrustPolicyReward,
  submitDeposit:submitDeposit,
  getRewardByApplyId:getRewardByApplyId,
  getDepositByTranId:getDepositByTranId,
  getTranById:getTranById,
  setAccountMobile:setAccountMobile,
  getAccountInfo:getAccountInfo
}
