const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');


const blogposts = require('./routes/blogposts.js')
const comments = require('./routes/comments.js')

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


app.use('/blogposts', blogposts);
app.use('/blogposts/:id/comments', comments)

// HOME
app.get('/', (req, res) => {
  res.render('home')
})

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
