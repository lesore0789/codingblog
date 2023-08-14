const express = require('express');
const router = express.Router();
const blogposts = require('../controllers/blogposts')
const catchAsync = require('../utils/catchAsync');
const BlogPost = require('../models/blogpost');
const {isLoggedIn, validateBlogPost, isAuthor} = require('../middleware');

// All BlogPosts - Index Page
router.get('/', catchAsync(blogposts.index))

// Create a new post
router.get('/new', isLoggedIn, blogposts.renderNewForm)

// Submitting the new Post
router.post('/', isLoggedIn, validateBlogPost, catchAsync(blogposts.createBlogPost))

// Show More Page
router.get('/:id', catchAsync(blogposts.showBlogPost))

// Edit Post
router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(blogposts.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, validateBlogPost, catchAsync(blogposts.updateBlogPost))

// Delete Post
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(blogposts.deleteBlogPost))

module.exports = router;
