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

app.get('/', (req, res) => {
  res.render('home')
})
app.get('/blogposts', async (req, res) => {
  const blogposts = await BlogPost.find({})
  res.render('blogposts/index', {blogposts})
})

app.listen(3000, () => {
  console.log('Serving on Port 3000')
})
