const express = require('express');
//const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const accountRoutes = require('./account.route');
const blockRoutes = require('./block.route');
const transactionRoutes = require('./transaction.route');
const policyRoutes = require('./policy.route');
const claimRoutes = require('./claim.route');
const auditorRoutes = require('./auditor.route');
const msgRoutes = require('./msg.route');
const chainAccountRoutes = require('./chain.accounts.route');
const chainBlockRoutes = require('./chain.block.route');
const chainTransactionRoutes = require('./chain.transaction.route');
const chainNodeRoutes = require('./chain.node.route');
const loginRoutes = require('./login.route');
const fileRoutes = require('./file.route');
const coinRoutes = require('./coin.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

//router.use('/users', userRoutes);
router.use('/auth', authRoutes);

/**
 * EOS Collections endpoints
 */
router.use('/accounts', accountRoutes);
router.use('/blocks', blockRoutes);
router.use('/transactions', transactionRoutes);

router.use('/chain/accounts', chainAccountRoutes);
router.use('/chain/transactions', chainTransactionRoutes);
router.use('/chain/blocks', chainBlockRoutes);
router.use('/chain/nodes', chainNodeRoutes);
router.use('/login', loginRoutes);


router.use('/policy', policyRoutes);
router.use('/claim', claimRoutes);
router.use('/auditor', auditorRoutes);
router.use('/msg', msgRoutes);//用户消息

router.use('/file', fileRoutes);
router.use('/coin', coinRoutes);


module.exports = router;
