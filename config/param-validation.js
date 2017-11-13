const Joi= require('joi');

module.exports ={
  // POST /api/enquiry
  createEnquiry: {
    body: {
      name : Joi.string().regex(/^([a-zA-Z0-9]){3,30}$/).options({ language: { string: { regex: { base: "should be valid name with minmum 3 and maximum 30 characters" } } } }).trim().required(),
      email : Joi.string().email().lowercase().required(),
      message : Joi.string().regex(/^([a-zA-Z0-9()@ ,.'-]){3,1000}$/).options({ language: { string: { regex: { base: `should be valid name with minmum 3 and maximum 1000 characters` } } } }).required()
    }
  },

  // UPDATE /api/enquiry/:enquiryId
  updateEnquiry: {
    body: {
      name : Joi.string().regex(/^([a-zA-Z0-9 .-]){3,30}$/).options({ language: { string: { regex: { base: "should be valid name with minmum 3 and maximum 30 characters" } } } }).trim().required(),
      email : Joi.string().email().lowercase().required(),
      message : Joi.string().regex(/^([a-zA-Z0-9()@ ,.'-]){3,1000}$/).options({ language: { string: { regex: { base: `should be valid name with minmum 3 and maximum 1000 characters` } } } }).required()
    },
    params: {
      _id: Joi.string().hex().required()
    }
  },

  // POST /api/auth/token
  genToken: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};
