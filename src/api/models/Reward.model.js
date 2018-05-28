const mongoose = require('mongoose');
const db2 = require('../../config/db2');

/**
 * Reward Schema
 * @private
 */
const rewardSchema = new mongoose.Schema(
  {
    applyId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    type: {
      type: Number,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    auditor: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    status: {
      type: Number,
      default: 0,
      required: true
    },
    ct: {
      type: Date,
      default: Date.now,
      required: true
    }
  },
  {
    //timestamps: true,
    versionKey: false,
    collection: 'Rewards'
  }
);

/**
 * Methods
 */
rewardSchema.method({

});

rewardSchema.statics = {

  /**
   * List Accounts in descending order of 'ct' timestamp.
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
  submitReward(option) {
    //this.findOne();
    let reward = new Reward(option);
    reward.save();
    return reward;
  }
};

/**
 * @typedef Reward
 */
const Reward = db2.model('Reward', rewardSchema);
module.exports = Reward;
