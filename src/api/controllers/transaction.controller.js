const aqp = require('api-query-params');
const fetch = require('isomorphic-fetch');
const Transaction = require('../models/transaction.model');
const { handler: errorHandler } = require('../middlewares/error');
// const { postTransaction } = require('../utils/eosd');
const { eosd, chain_id } = require('../../config/vars');
const getEthWallet = require('../utils/hdkey');
const web3 = require('../utils/ethconn');
const Tx = require('ethereumjs-tx');

/**
 * Load EOS account and append to req.
 * @public
 */
exports.load = async (req, res, next, txnId) => {
  try {
    const txn = await Transaction.get(txnId);
    req.locals = { txn };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get EOS Account
 * @public
 */
exports.get = (req, res) => res.json(req.locals.txn);

/**
 * Get Account list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = aqp(req.query);
    if (req.locals && req.locals.block) {
      query.filter = {
        ...query.filter,
        block_id: req.locals.block.block_id,
      };
    }
    const txns = await Transaction.list(query);
    res.json(txns);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    // const { resp, json } = await postTransaction(req.body);
    console.log(`--> fetching ${eosd.uri}/v1/chain/push_transaction`);
    console.log('--> body:', JSON.stringify(req.body, null, 2));
    const resp = await fetch(`${eosd.uri}/v1/chain/push_transaction`, {
      method: 'POST',
      body: JSON.stringify(req.body),
    });
    let json;
    if (resp.headers.get('content-type').indexOf('json') > -1) {
      const text = await resp.text();
      json = JSON.parse(text);
    } else {
      json = await resp.json();
    }
    const { scope, messages } = req.body;
    var fromWallet = getEthWallet(scope[0]);
    var toWallet = getEthWallet(scope[1]);
    var rawTx = {
      nonce: web3.eth.getTransactionCount(fromWallet.getAddressString()),
      from: fromWallet.getAdressString(),
      to: toWallet.getAdressString(),
      value: web3.toHex(),
      gasPrice: web3.toHex(web3.eth.gasPrice),
      gasLimit: web3.eth.getBlock("latest").gasLimit,
      chainId: web3.toHex(chain_id)
    };
    var tx = new Tx(rawTx);
    tx.sign(fromWallet.getPrivateKeyString());
    var serializedTx = tx.serialize();
    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
    res.status(resp.status);
    res.json(json);
  } catch (error) {
    next(error);
  }
};
