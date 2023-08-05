const Joi = require('joi');

module.exports.blogPostSchema = Joi.object({
  blogpost: Joi.object({
    title: Joi.string().required(),
    image: Joi.string().required(),
    body: Joi.string().required()
  }).required()
});
