const mongoose = require('mongoose');
const db2 = require('../../config/db2');

const types = [0,1,2,3];//0-boolean 1-Object 2-String 3-Array
/**
 * Config Schema
 * @private
 */
const depositSchema = new mongoose.Schema(
  {
    key:{
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    type:{
      type: Number,
      enum: types,
      default:0,
      required: true
    },
    val:{
      type: mongoose.Schema.Types.Mixed,
      required: true,
      trim: true
    },
    status: {
      type: Number,
      default:0,
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'Config',
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
    let deposit = new Config(option);
    deposit.save();
    return deposit;
  }
};

/**
 * @typedef Config
 */
const Config = db2.model('Config', depositSchema);
module.exports = Config;
