const httpStatus = require("http-status");
const { omit } = require("lodash");
const aqp = require("api-query-params");
const Block = require("../models/block.model");
const { handler: errorHandler } = require("../middlewares/error");
const { eosConfig } = require('../../config/eosconf');

/**
 * Load EOS Block and append to req.
 * @public
 */
exports.load = async (req, res, next, block_ident) => {
  try {
    const block = await Block.get(block_ident);
    req.locals = { block };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get EOS Block
 * @public
 */
exports.get = (req, res) => res.json(req.locals.block);

/**
 * Get Node list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    let json = {};
    json.success = true;
    json.code = 200;
    json.data = {"eos":[{"url":eosConfig.httpEndpoint,"description":"dawn-3.0.0，跳过交易签名校验"}]}
    res.json(json);
  } catch (error) {
    next(error);
  }
};
