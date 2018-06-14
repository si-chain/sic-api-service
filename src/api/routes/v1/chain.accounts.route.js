const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/chain.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const { createAccount, } = require('../../validations/account.validation');

const router = express.Router();

console.debug(ADMIN);
console.debug(LOGGED_USER);

router.param('chainName', controller.loadChainInfo);
router.param('accountName', controller.loadAccount);
//router.param('tranAccountName', controller.loadAccountTran);


router
  .route('/faucet')
  /**
   * @api {post} v1/chain/accounts/faucet Create a new account
   * @apiDescription Create a new address or account
   * @apiVersion 1.0.0
   * @apiName CreateAccount
   * @apiGroup ChainAccount
   * @apiPermission user
   *
   *
   * @apiParam  {String}             chainName="eos" chainName（eg：eos|eth）
   * @apiParam  {String}             password  password(chainName=eos is required)
   * @apiParam  {String{1..12}}      accountName  account(chainName=eos is required)
   * @apiParam  {Object}  keys       chainName=eos is required
   * @apiParam  {String}  keys.active    active key，chainName=eos is required
   * @apiParam  {String}  keys.owner     owner key，chainName=eos is required
   * @apiParam  {String}  inviteCode     inviteCode invite code
   *
   * @apiParamExample {json} eos request:
   * {
   *   "chainName": "eos",
   *   "accountName":"eosAccountName",
   *   "keys":{
   *      "active":"EOS8Pnz8ELTsL8b2nb3q45e8EN88hujrXm2fkUAG2w9sLjwz6cH6s",
   *      "owner":"EOS7TVTH2XL9j3Arg92CYW9PZjDbpzbSx1C4utzS5NuCZXo9sXUrh"
   *   }
   * }
   *
   * @apiParamExample {json} eth request:
   * {
   *   "chainName": "eth",
   *   "password":"123456"
   * }
   *
   * @apiSuccessExample {json} Success:
   *{
   *    "success": true,
   *    "code": 200,
   *    "data": {
   *        "transaction_id": "58cad4bbe679fb0a1362b92358f43d1a59dc1a89ae59e9fa4044e3725a36f3c9",
   *        "broadcast": true,
   *        "transaction": {
   *            "compression": "none",
   *            "transaction": {
   *                "expiration": "2018-04-17T09:31:41",
   *                "region": 0,
   *                "ref_block_num": 22380,
   *                "ref_block_prefix": 1222740791,
   *                "packed_bandwidth_words": 23,
   *                "context_free_cpu_bandwidth": 0,
   *                "context_free_actions": [],
   *                "actions": [
   *                    {
   *                        "account": "eosio",
   *                        "name": "newaccount",
   *                        "authorization": [
   *                            {
   *                                "actor": "eosio",
   *                                "permission": "active"
   *                            }
   *                        ],
   *                        "data": "0000000000ea305500000000a0f5236301000000010003c9211cd3d954f683e33f62f06f3f743c44ba7ebedc3082adae21cd13f21a3d640100000100000001000352539f65d92e2745be9fd1624a9a0cb93b7efb86ab72ba07a6eb8146f51131c30100000100000000010000000000ea305500000000a8ed32320100"
   *                    }
   *                ]
   *            },
   *            "signatures": [
   *                "EOSK49f1NvcwThFTAoJnZSr1Yz3vLaw7gLHVEdHvuoybMDwqRSwPpgZrrQRgzn4kwSEXmPGuX7HEVkmQo4jJAHasxagh69yJY"
   *            ]
   *        }
   *    }
   *}
   *
   * @apiSuccessExample {json} Error:
   * {
   *     "success": false,
   *     "code": 409,
   *     "message": "Conflict"
   * }
   *
   */
  .post(validate(createAccount),controller.faucet);




router
  .route('/:chainName/:accountName')
  /**
   * @api {get} v1/chain/accounts/:chainName/:accountName Get Account
   * @apiDescription Get Account information for a sepcific account identified by `:accountName`, which should be the `:chainName` chain.
   * @apiVersion 1.0.0
   * @apiName GetAccount
   * @apiGroup ChainAccount
   *
   *
   * @apiSuccess {String}  address            address
   * @apiSuccess {Number}  eos_balance        User's balance
   * @apiSuccess {Number}  staked_balance     User's staked balance
   * @apiSuccess {Number}  unstaking_balance  User's unstaking balance
   * @apiSuccess {Date}    createdAt          Timestamp
   *
   * @apiSuccessExample {json} Account exist:
   * {
   *     "success": true,
   *     "code": 200
   *     "data": {
   *         "account_name": "inita",
   *         "eos_balance": "999999.9991 EOS",
   *         "staked_balance": "0.0000 EOS",
   *         "unstaking_balance": "0.0000 EOS",
   *         "last_unstaking_time": "1969-12-31T23:59:59",
   *         "permissions": [
   *             {
   *                 "perm_name": "active",
   *                 "parent": "owner",
   *                 "required_auth": {
   *                     "threshold": 1,
   *                     "keys": [
   *                         {
   *                             "key": "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
   *                             "weight": 1
   *                         }
   *                     ],
   *                     "accounts": []
   *                 }
   *             },
   *             {
   *                 "perm_name": "owner",
   *                 "parent": "",
   *                 "required_auth": {
   *                     "threshold": 1,
   *                     "keys": [
   *                         {
   *                             "key": "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
   *                             "weight": 1
   *                         }
   *                     ],
   *                     "accounts": []
   *                 }
   *             }
   *         ]
   *     }
   * }
   *
   *
   * 
   *
   *
   * @apiSuccessExample {json} Account no exist:
   * {
   *     "success": false,
   *     "code": 400,
   *     "message": "account name not fond!"
   * }
   *
   *
   */
  .get(controller.get);

router
  .route('/actions/transfer/:tranAccountName')
  /**
   * @api {get} v1/chain/accounts/actions/transfer/:tranAccountName Get Transfer Action
   * @apiDescription 获得转账记录
   * @apiVersion 1.0.0
   * @apiName GetAccountTransaction
   * @apiGroup ChainAccount
   *
   * @apiParam  {Number{1-}}  [page=1]           page
   * @apiParam  {Number{1-}}  [pageNum=100]      count per page
   *
   * @apiSuccessExample {json} Success:
   * {
   *    "success": true,
   *    "code": 200,
   *    "data": {
   *        "count": 10,
   *        "page": 1,
   *        "pageNum": 2,
   *        "pageCount": 5,
   *        "records": [
   *            {
   *                "transaction_id": "3ede2874ab8f116f35da90158c276f659ba2851f8c134aaa476d07695aaa9ab0",
   *                "from": "zrm",
   *                "to": "gglzf4",
   *                "quantity": "0.0001 SIC",
   *                "memo": "Remark:1526351414507"
   *            },
   *            {
   *                "transaction_id": "e8c55b3f641b958acc1bf32b83f90b0bb0f72bb7ebbef697db7ba9dc27140ac6",
   *                "from": "zrm",
   *                "to": "gglzf4",
   *                "quantity": "0.0001 SIC",
   *                "memo": "Remark:1526351407225"
   *            }
   *        ]
   *    }
   * }
   *
   */
  .get(controller.getActionsByAccount);

module.exports = router;
