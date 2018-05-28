const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/msg.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const { smsCodeReqBody,verifySmsCodeReqBody } = require('../../validations/sms.validation');

const router = express.Router();

console.debug(ADMIN);
console.debug(LOGGED_USER);

//router.param('accountName', controller.loadAccount);
router.param('accountName', controller.loadMessagesByAccount);



router.route('/user/:accountName')
  /**
   * @api {get} v1/msg/user/:accountName Get account's msg list
   * @apiDescription Account's msg list
   * @apiVersion 1.0.0
   * @apiName UserMsgList
   * @apiGroup Msg
   *
   *
   * @apiParam  {String}      accountName              account
   * @apiParam  {Number{-1-}}      [limit=10]              Accounts per page
   * @apiParam  {Number{0-}}      [lowerBound=0]           List page
   *
   *
   * @apiSuccessExample {json} Success:
   * {
   *     "success": true,
   *     "code": 200,
   *     "data": {
   *         "rows": [
   *             {
   *                 "id": "1526460117431",
   *                 "type": 1,
   *                 "status": 0,
   *                 "msg": "INFO",
   *                 "reward": "1.0000 SIC",
   *                 "applicant": "sic.auth",
   *                 "dt": "2018-05-16T08:41:58",
   *                 "reqKey": "EOS67Ehn1RVwdZ8vH6JePDz3HbHQWirsNZVcntizrCNH9ETNcvGRe",
   *                 "authValue": "[{'applyId':121211231233,'val':''}]"
   *             }
   *         ],
   *         "more": false
   *     }
   * }
   *
   */
  .get(controller.getUserMessages);



router.route('/user/:userAccount/:authId')
  /**
   * @api {get} v1/msg/user/:userAccount/:authId User's msg info
   * @apiDescription User's msg info
   * @apiVersion 1.0.0
   * @apiName UserMsg
   * @apiGroup Msg
   *
   * @apiParam  {String}      userAccount            account
   * @apiParam  {String}      authId              request seq by mch
   *
   * @apiSuccessExample {json} Success:
   * {
   *    "success": true,
   *    "code": 200,
   *    "data": {
   *        "authID": "1526266188300",
   *        "type": 1,
   *        "requester": "sic.auth",
   *        "req_pubkey": "EOS67Ehn1RVwdZ8vH6JePDz3HbHQWirsNZVcntizrCNH9ETNcvGRe",
   *        "status": 20,
   *        "req_time": "2018-05-14T02:49:57",
   *        "agree_time": "1970-01-01T00:00:00",
   *        "howlong": 1231231111,
   *        "auth_value": "==vdskelsdfjeikskdljfklwj3lkfjlskdjosjejfljivcxjlkfjlwkefl"
   *    }
   * }
   *
   */
  .get(controller.getUserMessage);



router.route('/mch/:mchAccount')
  /**
   * @api {get} v1/msg/mch/:mchAccount Mch's msg list
   * @apiDescription Mch's msg list
   * @apiVersion 1.0.0
   * @apiName MchMsgList
   * @apiGroup Msg
   *
   * @apiParam  {Number{-1-}}      [limit=10]              Accounts per page
   * @apiParam  {Number{0-}}      [lowerBound=0]           List page
   *
   *
   * @apiSuccessExample {json} Success:
   * {
   *     "success": true,
   *     "code": 200,
   *     "data": {
   *         "rows": [
   *             {
   *                 "authID": "1525948923186",
   *                 "user": "gbghbn",
   *                 "status": 10
   *             }
   *         ],
   *         "more": true
   *     }
   * }
   *
   */
  .get(controller.getMchMessages);

router.route('/sms/code')
  /**
   * @api {post} v1/msg/sms/code Get code from sms
   * @apiDescription get code from mobile sms
   * @apiVersion 1.0.0
   * @apiName GetCodeFromMobile
   * @apiGroup Msg
   *
   * @apiHeader {String} content-type="application/json"
   *
   * @apiParam  {String}       mobile          user's cellphone number
   * @apiParam  {String}      [captcha='']     captcha
   * @apiParam  {String}      [country=86]     country
   *
   *
   * @apiSuccessExample {json} Success:
   * {
   *  "success": true,
   *  "code": 200,
   * }
   *
   */
  .post(validate(smsCodeReqBody),controller.getSmsCode);

router.route('/sms/code/verify')
  /**
   * @api {post} v1/msg/sms/code/verify Verify mobile code
   * @apiDescription verify mobile code
   * @apiVersion 1.0.0
   * @apiName VerifyMobileCode
   * @apiGroup Msg
   *
   * @apiHeader {String} content-type="application/json"
   * @apiParam  {String}       account         user's account
   * @apiParam  {String}       mobile          user's cellphone number
   * @apiParam  {String}       code            sms code
   * @apiParam  {String}      [country=86]     country
   *
   *
   * @apiSuccessExample {json} Success:
   * {
   *  "success": true,
   *  "code": 200,
   *  "data": {
   *
   *  }
   * }
   *
   */
  .post(validate(verifySmsCodeReqBody),controller.verifySmsCode);




module.exports = router;
