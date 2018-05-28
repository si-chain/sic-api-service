const Joi = require('joi');
const Policy = require('../models/policy.model');

module.exports = {

  // POST /v1/users
  applyTrust: {
    body: {
      name: Joi.string()
    },
  },

  trustPolicy: {
    body: {
      entity: Joi.string(),
      type: Joi.string().valid(Policy.types),
      version: Joi.string(),
      header: Joi.string(),
    },
  },


};
