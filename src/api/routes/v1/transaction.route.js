const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/transaction.controller');
const { authorize } = require('../../middlewares/auth');
const { listTransactions, createTransaction } = require('../../validations/transaction.validation');

const router = express.Router({ mergeParams: true });





module.exports = router;
