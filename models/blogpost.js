const mongoose = require('mongoose');
const Comment = require('./comment')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_250')
})

const BlogPostSchema = new Schema({
  title: String,
  subTitle: String,
  images: [ImageSchema],
  date: Date,
  body: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
})

BlogPostSchema.post('findOneAndDelete', async function(doc){
  if(doc) {
    await Comment.deleteMany({
      _id: {
        $in: doc.comments
      }
    })
  }
})

module.exports = mongoose.model('BlogPost', BlogPostSchema)
