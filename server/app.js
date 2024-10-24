// why is connection string not working on mongoDB compass and heroku for submission**
// it is still putting the simple models assignment on mongoDB compass**
// go over mongoDB compass and how to submit to heroku**
// what is build and building scripts saying in rubric**
// we should be able to connect and disconnect from the server and restart
// it and the data should still be perserved right for login and signup**
// is build penalty basically not changing the package.json and having the webpack**
// there are not any of the examples listed in my package.json for build penalty**
// how to check if router works correctly**
// for the app working correctly we should be able to access each page listed in router.js right**
// for login or sign up being directed to app page is the character creation page right**

// go over cookies screenshot for domo maker B**
// when I restart the server I cannot go back to logout page to log back in
// and the server crashes and I have to restart the server is this what is supposed to happen**
// step 17 and 20**

// First, we need to add sessions so that we can accurately track who logged in and
// who they are. In a stateless transaction, every transaction is new, so we need a ticket
// to identify this person. We use sessions to handle that for us.

// A session is a uniquely generated key that is tracked by the server to map to an
// individual user. The unique key is then sent to the user as a cookie that the server
// can track. In each request, the cookies are sent back to the server, in which it will
// then see if it has a session id that matches that unique cookie.**

// cookies are basically used for sessions and to log a user out if they are
// logged in for too long with or without activity**

// Cookies are just key:value pairs set by the server or browser for tracking purposes.**

// As such, you want to make sure you secure your cookies and refresh them over time.
// This usually means automatically logging users out or just sending them a new
// session id back sometimes. This limits how long a key is available, and how much
// time in which it could potentially be stolen. There are added protections against this
// that we will also add later.**

const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');

// what is helmet (go over where it is defined as well)**
// Some of the libraries used above are not ones we have seen before. Here are some
// brief descriptions.
// Helmet: a security library for express. Sets a bunch of default options for us to
// obscure information from malicious attacks (what kind of attacks)**
const helmet = require('helmet');

const session = require('express-session');

// ../ means go up a folder but ./ means in the same folder right**
// and / means go to the root directory right**
const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Use “mongodb://127.0.0.1/DomoMaker” and the process.env.MONGODB_URI
// variable for the database connection. Node will first attempt to connect to your
// MongoDB Cloud instance (first option)**, and will fallback to your
// local Mongo instance (second option)**
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/DomoMaker';

mongoose.connect(dbURI).catch((err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

const app = express();

app.use(helmet());
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// In your app.js, add a section for session configuration. To do this, tell your express
// app to use express-session. The express-session module takes several configuration
// options as a JSON object (it is not there)**
// Once it is configured, the session module will add a
// session object to every request object which can be accessed by saying
// “req.session”. This session object can be used to track and store information unique
// to that user between requests.**
app.use(session({
  // name of our cookie so it can be tracked in requests
  // when the browser sends requests the cookies will come as well
  // the key tells our session module which cookie to look for when
  // looking for a session cookie (we can have multiple sessions set up for)**
  // for security purposes we should use a key name
  key: 'sessionid',
  // private string used as a seed for hashing/creating unique session keys
  // this makes it so our unique session keys are different
  // from other servers using express
  // The secret can be changed to anything you want, but will invalidate
  // existing session ids (which isn’t necessarily a huge issue)**
  secret: 'Domo Arigato',
  // set to false tells the session library to only send the session key
  // back to the databse if it changes
  // if it were true then we would generate a lot of databse
  // requests that are unecessary (when do we set it to true)**
  resave: false,
  // The saveUninitialized option set to false prevents us
  // from saving uninitialized sessionids to the database (invalid session types
  // or session types that do not exist yet)**
  saveUninitialized: false,
}));

app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
