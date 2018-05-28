const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/auditor.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');

const router = express.Router();

console.debug(ADMIN);
console.debug(LOGGED_USER);

//router.param('accountName', controller.loadAccount);




router.route('/list')
  /**
   * @api {get} v1/auditor/list Get auditor list
   * @apiDescription Get auditors list
   * @apiVersion 1.0.0
   * @apiName AuditorList
   * @apiGroup Auditor
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
   *               "auditor": "zrm"
   *           },
   *           {
   *               "auditor": "eos"
   *           }
   *       ],
   *       "more": false
   *   }
   *}
   *
   */
  .get(controller.getAuditors);


router.route('/admins')
/**
 * @api {get} v1/auditor/admins Get admin list
 * @apiDescription Get admin list
 * @apiVersion 1.0.0
 * @apiName AuditorAdminList
 * @apiGroup Auditor
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
   *               "admin": "zrm"
   *           },
   *           {
   *               "admin": "eos"
   *           }
   *       ],
   *       "more": false
   *   }
   *}
 *
 */
  .get(controller.getAdmins);




router.route('/mches')
  /**
   * @api {get} v1/auditor/mches Get mch list
   * @apiDescription Get mch list
   * @apiVersion 1.0.0
   * @apiName AuditorMchList
   * @apiGroup Auditor
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
   *               "account": "zrm"
   *           },
   *           {
   *               "account": "eos"
   *           }
   *       ],
   *       "more": false
   *   }
   *}
   *
   */
  .get(controller.getMches);




module.exports = router;
