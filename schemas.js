const Joi = require('joi');

module.exports.blogPostSchema = Joi.object({
  blogpost: Joi.object({
    title: Joi.string().required(),
    // image: Joi.string().required(),
    body: Joi.string().required()
  }).required(),
  deleteImages: Joi.array()
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required()
  }).required()
});
