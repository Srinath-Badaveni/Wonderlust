const User = require("../models/user");


module.exports.renderSignUp = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WonderLust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/user");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "welcome back!!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "logout success");
    res.redirect("/listings");
  });
};