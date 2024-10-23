// why do we need these and what does it do**
// models only has access to index.js since we only called the folder right
// then from that folder we want to access account in
// the models folder so we do models.account to access it**
const models = require('../models');

const { Account } = models;

// we do this if we do not have any data to pass into varaibles in the HTML
// if we do have things to pass into the varaibles in the HTML, then we have a second
// parameter to fill in those varaibles**
const loginPage = (req, res) => res.render('login');

const signupPage = (req, res) => res.render('signup');

// this puts the user back at the default page which is the login page**
const logout = (req, res) => res.redirect('/');

// Similar to signup, we make sure we have all the data then we call the Model to
// handle the database entry for us. We are calling the Model’s static authenticate
// function. Again, to see how this works, just look at the function in the Account Model
// why don't we have to say AccountSchema.statics.authenticate like it is in account.js in models**
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    return res.json({ redirect: '/maker' });
  });
};

// This function will have a bit of complexity to it due to the encryption process. If you want to
// see how it works, look at the Account Model’s generateHash static function.**
// First, we validate the data. We cast to strings to guarantee valid types and then check
// if it is all there and the passwords match.**
// why do we need async here and we do not in the other functions**
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    // this goes to the function to hash in the account.js in models (why don't we use
    // acount schema or statics)**
    const hash = await Account.generateHash(pass);
    // create a new user in the database (the account schema)** and save it in the database**
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    // Provided the save works, we will send the user a redirect message that sends them
    // to the /maker page. Note that because of how sendPost() in client.js handles server
    // responses we can do this.**
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

module.exports = {
  loginPage,
  signupPage,
  login,
  logout,
  signup,
};
