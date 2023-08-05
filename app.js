const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { blogPostSchema } = require('./schemas.js')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const BlogPost = require('./models/blogpost');

mongoose.connect('mongodb://127.0.0.1:27017/codingblog');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected")
})

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// This is for Post requests, tells Express to parse the body
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));

const validateBlogPost = (req, res, next) => {
  const { error } = blogPostSchema.validate(req.body);
  if(error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
};

// HOME
app.get('/', (req, res) => {
  res.render('home')
})

// All BlogPosts - Index Page
app.get('/blogposts', async (req, res) => {
  const blogposts = await BlogPost.find({})
  res.render('blogposts/index', {blogposts})
})

// Create a new post
app.get('/blogposts/new', (req, res) => {
  res.render('blogposts/new')
})

// Submitting the new Post
app.post('/blogposts', validateBlogPost, catchAsync(async (req, res, next) => {
  // if(!req.body.blogpost) throw new ExpressError('Invalid BlogPost Data', 400);
  const blogpost = new BlogPost(req.body.blogpost);
  await blogpost.save();
  res.redirect(`/blogposts/${blogpost._id}`)
}))

// Show More Page
app.get('/blogposts/:id', catchAsync(async (req, res) => {
  const blogpost = await BlogPost.findById(req.params.id)
  res.render('blogposts/show', {blogpost})
}))

// Edit Post
app.get('/blogposts/:id/edit', catchAsync(async (req, res) => {
  const blogpost = await BlogPost.findById(req.params.id);
  res.render('blogposts/edit', {blogpost})
}))

app.put('/blogposts/:id', validateBlogPost, catchAsync(async (req, res) => {
  const { id } = req.params;
  const blogpost = await BlogPost.findByIdAndUpdate(id, {...req.body.blogpost});
  res.redirect(`/blogposts/${blogpost._id}`)
}))

// Delete Post
app.delete('/blogposts/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await BlogPost.findByIdAndDelete(id);
  res.redirect('/blogposts')
}))

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

// Error
app.use((err, req, res, next) => {
  const {statusCode = 500} = err;
  if(!err.message) err.message = 'Something Went Wrong'
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log('Serving on Port 3000')
})
