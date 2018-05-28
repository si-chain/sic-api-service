const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/block.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const transactionController = require('../../controllers/transaction.controller');
const { listTransactions } = require('../../validations/transaction.validation');
const { listBlocks } = require('../../validations/block.validation');

const router = express.Router({ mergeParams: true });

/**
 * Load EOS account when API with accountName route parameter is hit
 */
router.param('blockIdent', controller.load);

/**
 * Load EOS transaction when API with transaction identifier route parameter is hit
 */
router.param('txnId', transactionController.load);



module.exports = router;
