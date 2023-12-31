const express = require('express');
const router = express.Router();
const blogposts = require('../controllers/blogposts')
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateBlogPost, isAuthor} = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// All BlogPosts - Index Page, Submitting the new Post
router.route('/')
  .get(catchAsync(blogposts.index))
  .post(isLoggedIn, upload.array('image'), validateBlogPost, catchAsync(blogposts.createBlogPost))

// Create a new post
router.get('/new', isLoggedIn, blogposts.renderNewForm)

// Show More Page, Edit Post, Delete Post
router.route('/:id')
  .get(catchAsync(blogposts.showBlogPost))
  .put(isLoggedIn, isAuthor, upload.array('image'), validateBlogPost, catchAsync(blogposts.updateBlogPost))
  .delete(isLoggedIn, isAuthor, catchAsync(blogposts.deleteBlogPost))

// Edit Form
router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(blogposts.renderEditForm))

module.exports = router;
