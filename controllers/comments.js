const BlogPost = require('../models/blogpost');
const Comment = require('../models/comment');

module.exports.createComment = async (req, res) => {
  const blogpost = await BlogPost.findById(req.params.id);
  const comment = new Comment(req.body.comment);
  comment.author = req.user._id;
  blogpost.comments.push(comment);
  await comment.save();
  await blogpost.save();
  req.flash('success', 'Created new comment')
  res.redirect(`/blogposts/${blogpost._id}`)
}

module.exports.deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  await BlogPost.findByIdAndUpdate(id, {$pull: {comments: commentId}})
  await Comment.findByIdAndDelete(commentId);
  res.redirect(`/blogposts/${id}`);
}
