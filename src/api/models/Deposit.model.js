const mongoose = require('mongoose');
const db2 = require('../../config/db2');

/**
 * Deposit Schema
 * @private
 */
const depositSchema = new mongoose.Schema(
  {
    transaction_id:{
      type: String,
      required: true,
      trim: true
    },
    /*user: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },*/
    account:{
      type: String,
      required: true,
      trim: true
    },
    quantity:{
      type: String,
      required: true,
      trim: true
    },
    eth_address:{
      type: String,
      required: true,
      trim: true
    },
    memo:{
      type: String,
      trim: true,
      default: null
    },
    tx:{
      type: String,
      trim: true,
      default: null
    },
    status: {
      type: Number,
      default:0,
      required: true
    },
    ct: {
      type: Date,
      default: Date.now,
      required: true
    },
    ft: {
      type: Date,
      default: null
    },
  },
  {
    versionKey: false,
    collection: 'Deposits',
  },
);

/**
 * Methods
 */
depositSchema.method({

});

depositSchema.statics = {
  /**
   * List Accounts in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of entities to be skipped.
   * @param {number} limit - Limit number of entities to be returned.
   * @param {Object} [sort] - Object w/ keys matching fieldnames to be sorted, values as -1 (desc), 1 (asc)
   * @param {Object} [filter] - Object matching a Mongoose query object
   * @param {Object|String} [projection] - Mongoose `select()` arg denoting fields to include or exclude
   * @returns {Promise<Block[]>}
   */
  list({ skip = 0, limit = 30, sort, filter, projection }) {
    return this.find(filter)
      .sort(sort || { ct: -1 })
      .select(projection)
      .skip(skip)
      .limit(limit)
      .exec();
  },
  submitDeposit(option) {
    //this.findOne();
    let deposit = new Deposit(option);
    deposit.save();
    return deposit;
  }
};

/**
 * @typedef Deposit
 */
const Deposit = db2.model('Deposit', depositSchema);
module.exports = Deposit;
