const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/coin.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  applyTrust,trustPolicy,
} = require('../../validations/policy.validation');

const router = express.Router();




router.route('/withdraw/:transactionId/:ethAddress')
  /**
   * @api {get} v1/coin/withdraw/:transactionId/:ethAddress Withdraw
   * @apiDescription  Withdraw with transaction_id and eth address
   * @apiVersion 1.0.0
   * @apiName Withdraw
   * @apiGroup Coin
   *
   * @apiParam  {String}      transactionId       transaction_id
   * @apiParam  {String}      ethAddress          eth address
   *
   * @apiSuccessExample {json} Success:
   * {
   *     "success": true,
   *     "code": 200
   * }
   *
   */
  .get(controller.withdraw);








module.exports = router;
