const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
  res.render('users/register')
};

module.exports.register = async(req, res, next) => {
  try {
    const {email, username, password, adminCode} = req.body;
    const user = new User({email, username});
    if(adminCode === process.env.ADMIN_CODE) {
      user.isAdmin = true;
    }
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if(err) return next(err);
      req.flash('success','Welcome to Code with Leslie');
      res.redirect('/blogposts');
    })
  } catch(e) {
    req.flash('error', e.message);
    res.redirect('register')
  }
}

module.exports.renderLoginForm = (req, res) => {
  res.render('users/login')
}

module.exports.login = (req, res) => {
  req.flash('success', 'Welcome Back!');
  const redirectUrl = res.locals.returnTo || '/blogposts';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
      if (err) {
          return next(err);
      }
      req.flash('success', 'Goodbye!');
      res.redirect('/blogposts');
  });
}
