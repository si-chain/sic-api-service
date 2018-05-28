const httpStatus = require('http-status');
const { omit } = require('lodash');
const aqp = require('api-query-params');
const { handler: errorHandler } = require('../middlewares/error');
const eosService = require('../services/eos.service');
const { sic } = require('../../config/constant');


exports.withdraw = async (req, res, next) => {
  let tranId = req.params.transactionId;
  let ethAddress = req.params.ethAddress;

  let json = {success:false,code:400};

  let deposit = await eosService.getDepositByTranId(tranId);
  if(!deposit){
    let tran = await eosService.getTranById(tranId);
    if(tran){
      let actions = tran.transaction.transaction.actions;
      if(actions.length > 0){
        let users = [];
        for(i in actions){
          let action = actions[i];
          if(action.name === sic.contract.token.action.withdraw && action.account === sic.contract.token.code){
            let from = action.data.from;
            let quantity = action.data.quantity;
            let memo = action.data.memo;
            users.push({transaction_id:tranId,account:from,quantity:quantity,eth_address:ethAddress,memo:memo,tx:null,fn:null,status:sic.token.reward.undo})
          }
        }
        if(users.length > 0){
          let id = eosService.submitDeposit(tranId,users);
          if(id){
            console.info(id);
            json.success = true;
            json.code = 200;
          }else{
            json.message = 'submit error,please try again later!';
          }
        }else{
          json.message = 'The transaction not find deposit!';
        }
      }else{
        json.message = 'There are not find actions!';
      }
    }else{
      json.message = 'This transaction_id not found!';
    }
  }else{
    json.message = 'This transaction_id had deposited!';
  }
  res.json(json);
};





