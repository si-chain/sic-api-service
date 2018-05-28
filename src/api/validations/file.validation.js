const Joi = require('joi');

let file = {
  path:Joi.string().required()
}

module.exports = {

  //
  authReqBody: {
    body: {
      files: Joi.array().items(file).required()
    },
  }



};
