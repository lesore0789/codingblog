const BlogPost = require('../models/blogpost');
const { cloudinary } = require("../cloudinary")

module.exports.index = async (req, res) => {
  const blogposts = await BlogPost.find({})
  res.render('blogposts/index', {blogposts})
}

module.exports.renderNewForm = (req, res) => {
  res.render('blogposts/new')
}

module.exports.createBlogPost = async (req, res, next) => {
  const blogpost = new BlogPost(req.body.blogpost);
  blogpost.images = req.files.map(f => ({url: f.path, filename: f.filename}));
  blogpost.author = req.user._id;
  await blogpost.save();
  console.log(blogpost);
  req.flash('success', 'Successfully made a new Blog Post!')
  res.redirect(`/blogposts/${blogpost._id}`)
}

module.exports.showBlogPost = async (req, res) => {
  const blogpost = await BlogPost.findById(req.params.id).populate({
    path: 'comments',
    populate: {
      path: 'author'
    }
  }).populate('author');
  if(!blogpost){
    req.flash('error', 'Cannot find that blogpost');
    return res.redirect('/blogposts')
  }
  res.render('blogposts/show', {blogpost})
}

module.exports.renderEditForm = async (req, res) => {
  const {id} = req.params;
  const blogpost = await BlogPost.findById(id);
  if(!blogpost){
    req.flash('error', 'Cannot find that post');
    return res.redirect('/blogposts')
  }
  res.render('blogposts/edit', {blogpost})
}

module.exports.updateBlogPost = async (req, res) => {
  const { id } = req.params;
  const blogpost = await BlogPost.findByIdAndUpdate(id, {...req.body.blogpost});
  const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
  blogpost.images.push(...imgs);
  await blogpost.save();
  if(req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      cloudinary.uploader.destroy(filename);
    }
    await blogpost.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
  }
  req.flash('success', 'Successfuly updated blogpost');
  res.redirect(`/blogposts/${blogpost._id}`)
}

module.exports.deleteBlogPost = async (req, res) => {
  const { id } = req.params;
  await BlogPost.findByIdAndDelete(id);
  res.redirect('/blogposts')
}
