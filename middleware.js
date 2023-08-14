const { blogPostSchema, commentSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError.js');
const BlogPost = require('./models/blogpost');

module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You Must Be Signed In');
    return res.redirect('/login')
  }
  next();
}

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
      res.locals.returnTo = req.session.returnTo;
  }
  next();
}

module.exports.validateBlogPost = (req, res, next) => {
  const { error } = blogPostSchema.validate(req.body);
  if(error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
};

module.exports.isAuthor = async(req, res, next) => {
  const {id} = req.params;
  const blogpost = await BlogPost.findById(id);
  if(!blogpost.author.equals(req.user._id)){
    req.flash('error', 'You do not have permission to do that');
    return res.redirect(`/blogposts/${id}`);
  }
  next();
}

module.exports.validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if(error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}
