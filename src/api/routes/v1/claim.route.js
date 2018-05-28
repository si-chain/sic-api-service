const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/claim.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  applyTrust,trustPolicy,
} = require('../../validations/policy.validation');

const router = express.Router();

console.debug(ADMIN);
console.debug(LOGGED_USER);

//router.param('accountName', controller.loadAccount);
router.param('accountPolicy', controller.loadPoliciesByAccount);
router.param('accountReview', controller.loadReviewPoliciesByAccount);


router.route('/unapprove/list')
  /**
   * @api {get} v1/claim/unapprove/list Claim unapprove list
   * @apiDescription Claim unapprove list
   * @apiVersion 1.0.0
   * @apiName ClaimList
   * @apiGroup Claim
   *
   * @apiParam  {Number{-1-}}      [limit=10]              Accounts per page
   * @apiParam  {Number{0-}}      [lowerBound=0]           List page
   *
   *
   * @apiSuccessExample {json} Success:
   *{
   *   "success": true,
   *   "code": 200,
   *   "data": {
   *       "rows": [
   *           {
   *               "ID": 0,
   *               "ossCheckCode": "{\"name\":\"zrm\"}"
   *           },
   *           {
   *               "ID": 1,
   *               "ossCheckCode": "{\"name\":\"zrm\"}"
   *           }
   *       ],
   *       "more": true
   *   }
   *}
   *
   */
  .get(controller.unapprovePolicyList);


router
  .route('/list/:accountPolicy')
  /**
   * @api {get} v1/claim/list/:accountName Account's claim list
   * @apiDescription Account's claim list
   * @apiVersion 1.0.0
   * @apiName AccountClaimList
   * @apiGroup Claim
   *
   *
   *
   * @apiParam  {Number{-1-}}      [limit=10]              Accounts per page
   * @apiParam  {Number{0-}}      [lowerBound=0]           List page
   *
   *
   *
   * @apiSuccessExample {json} Success:
   * {
   *     "success": true,
   *     "code": 200,
   *     "data": {
   *         "rows": [
   *             {
   *                 "ID": 22,
   *                 "status": 0,
   *                 "ossID": "d2323333",
   *                 "ossCheckCode": "{\"name\":\"zrm\"}",
   *                 "producer": "eos",
   *                 "reviewer": "",
   *                 "policyID": "0000000000000000000000000000000000000000000000000000000000000000",
   *                 "value": "{}"
   *             }
   *         ],
   *         "more": true
   *     }
   * }
   *
   */
  .get(controller.getPolicyByAccount);

router
  .route('/review/:accountReview')
  /**
   * @api {get} v1/claim/review/:accountReview Account's review claim list
   * @apiDescription Account's review claim list
   * @apiVersion 1.0.0
   * @apiName AccountReviewClaimList
   * @apiGroup Claim
   *
   *
   *
   * @apiParam  {Number{-1-}}      [limit=10]              Accounts per page
   * @apiParam  {Number{0-}}      [lowerBound=0]           List page
   *
   *
   *
   * @apiSuccessExample {json} 成功返回:
   * {
   *     "success": true,
   *     "code": 200,
   *     "data": {
   *         "rows": [
   *             {
   *                 "ID": "15247299949140",
   *                 "ossAddr": "{\"files\":[]}",
   *                 "producer": "zrm"
   *             },
   *             {
   *                 "ID": "15247299949141",
   *                 "ossAddr": "{\"files\":[]}",
   *                 "producer": "zrm"
   *             }
   *         ],
   *         "more": false
   *     }
   * }
   *
   */
  .get(controller.getReviewPolicyByAccount);


module.exports = router;
