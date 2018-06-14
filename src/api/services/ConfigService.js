const Config = require('../models/Config.model');

function getValByKey(key) {
  let config = Config.findOne({key:key});
  return config.val;
}

module.exports = {
    getValByKey:getValByKey,
}