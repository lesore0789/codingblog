const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')

const userRoutes = require('./routes/users')
const blogpostRoutes = require('./routes/blogposts.js')
const commentRoutes = require('./routes/comments.js')

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

// Tells Express to serve our public directory
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
  secret: 'thisshouldbeasecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 *24 * 7,
    maxAge: 1000 * 60 * 60 *24 * 7
  }
}
app.use(session(sessionConfig))

app.use(flash());

// Flash Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error')
  next();
})

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', userRoutes);
app.use('/blogposts', blogpostRoutes);
app.use('/blogposts/:id/comments', commentRoutes)

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
