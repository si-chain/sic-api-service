const Joi = require('joi');
module.exports = {

  //
  smsCodeReqBody: {
    body: {
      mobile: Joi.string().regex(/1[0-9]{10}/).min(11).max(11).required(),
      captcha: Joi.string(),
      country: Joi.number()
    },
  },

  verifySmsCodeReqBody: {
    body: {
      account: Joi.string().min(1).max(32).required(),
      mobile: Joi.string().regex(/1[0-9]{10}/).min(11).max(11).required(),
      code: Joi.string().min(4).max(8).required(),
      country: Joi.number()
    },
  },



};
