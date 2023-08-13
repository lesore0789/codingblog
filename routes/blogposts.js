const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const BlogPost = require('../models/blogpost');
const { blogPostSchema } = require('../schemas.js');
const {isLoggedIn} = require('../middleware');

const validateBlogPost = (req, res, next) => {
  const { error } = blogPostSchema.validate(req.body);
  if(error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
};

// All BlogPosts - Index Page
router.get('/', async (req, res) => {
  const blogposts = await BlogPost.find({})
  res.render('blogposts/index', {blogposts})
})

// Create a new post
router.get('/new', isLoggedIn, (req, res) => {
  res.render('blogposts/new')
})

// Submitting the new Post
router.post('/', isLoggedIn, validateBlogPost, catchAsync(async (req, res, next) => {
  // if(!req.body.blogpost) throw new ExpressError('Invalid BlogPost Data', 400);
  const blogpost = new BlogPost(req.body.blogpost);
  blogpost.author = req.user._id;
  await blogpost.save();
  req.flash('success', 'Successfully made a new Blog Post!')
  res.redirect(`/blogposts/${blogpost._id}`)
}))

// Show More Page
router.get('/:id', catchAsync(async (req, res) => {
  const blogpost = await BlogPost.findById(req.params.id).populate('comments').populate('author');
  if(!blogpost){
    req.flash('error', 'Cannot find that blogpost');
    return res.redirect('/blogposts')
  }
  res.render('blogposts/show', {blogpost})
}))

// Edit Post
router.get('/:id/edit', catchAsync(async (req, res) => {
  const blogpost = await BlogPost.findById(req.params.id);
  res.render('blogposts/edit', {blogpost})
}))

router.put('/:id', validateBlogPost, catchAsync(async (req, res) => {
  const { id } = req.params;
  const blogpost = await BlogPost.findByIdAndUpdate(id, {...req.body.blogpost});
  req.flash('success', 'Successfuly updated blogpost');
  res.redirect(`/blogposts/${blogpost._id}`)
}))

// Delete Post
router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await BlogPost.findByIdAndDelete(id);
  res.redirect('/blogposts')
}))

module.exports = router;
