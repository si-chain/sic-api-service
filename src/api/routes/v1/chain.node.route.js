const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/node.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const transactionController = require('../../controllers/transaction.controller');
const { listTransactions } = require('../../validations/transaction.validation');
const { listBlocks } = require('../../validations/block.validation');

const router = express.Router({ mergeParams: true });

/**
 * Load account when API with accountName route parameter is hit
 */
router.param('blockIdent', controller.load);

/**
 * Load    transaction when API with transaction identifier route parameter is hit
 */
router.param('txnId', transactionController.load);

router
  .route('/')
  /**
   * @api {get} v1/chain/nodes Get chain node list
   * @apiDescription get chain node list
   *
   * @apiVersion 1.0.0
   * @apiName ListNodes
   * @apiGroup  ChainNode
   *
   *
   * @apiSuccessExample {json} Success Response:
   *{
   *    "success": true,
   *    "code": 200,
   *    "data": {
   *        "eos": [
   *            {
   *                "url": "http://10.3.1.136:8888",
   *                "description": "dawn-3.0.0"
   *            }
   *        ]
   *    }
   *}
   *
   */
  .get(controller.list);





module.exports = router;
