const Joi = require('joi');

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
      type: Joi.string(),
      version: Joi.string(),
      header: Joi.string(),
    },
  },


};
