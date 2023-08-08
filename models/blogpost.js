const mongoose = require('mongoose');
const Comment = require('./comment')
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
  title: String,
  subTitle: String,
  image: String,
  date: Date,
  body: String,
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
