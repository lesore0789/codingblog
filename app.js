const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const BlogPost = require('./models/blogpost');

mongoose.connect('mongodb://127.0.0.1:27017/codingblog');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected")
})

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// This is for Post requests, tells Express to parse the body
app.use(express.urlencoded({extended: true}))

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
app.post('/blogposts', async (req, res) => {
  const blogpost = new BlogPost(req.body.blogpost);
  await blogpost.save();
  res.redirect(`/blogposts/${blogpost._id}`)
})

// Show More Page
app.get('/blogposts/:id', async (req, res) => {
  const blogposts = await BlogPost.findById(req.params.id)
  res.render('blogposts/show', {blogposts})
})



app.listen(3000, () => {
  console.log('Serving on Port 3000')
})
