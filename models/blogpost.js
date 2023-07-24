const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
  title: String,
  subTitle: String,
  date: Date,
  body: String

})

module.exports = mongoose.model('BlogPost', BlogPostSchema)
