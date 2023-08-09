const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { blogPostSchema, commentSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const BlogPost = require('./models/blogpost');
const Comment = require('./models/comment.js');

const blogposts = require('./routes/blogposts.js')

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


const validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if(error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

app.use('/blogposts', blogposts)

// HOME
app.get('/', (req, res) => {
  res.render('home')
})


// Comment Routes
app.post('/blogposts/:id/comments', validateComment, catchAsync(async (req, res) => {
  const blogpost = await BlogPost.findById(req.params.id);
  const comment = new Comment(req.body.comment);
  blogpost.comments.push(comment);
  await comment.save();
  await blogpost.save();
  res.redirect(`/blogposts/${blogpost._id}`)
}))

app.delete('/blogposts/:id/comments/:commentId', catchAsync(async (req, res) => {
  const { id, commentId } = req.params;
  await BlogPost.findByIdAndUpdate(id, {$pull: {comments: commentId}})
  await Comment.findByIdAndDelete(commentId);
  res.redirect(`/blogposts/${id}`);
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
