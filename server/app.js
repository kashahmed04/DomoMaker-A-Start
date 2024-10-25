// First, we need to add sessions so that we can accurately track who logged in and
// who they are. In a stateless transaction, every transaction is new, so we need a ticket
// to identify this person. We use sessions to handle that for us.

// A session is a uniquely generated key that is tracked by the server to map to an
// individual user. The unique key is then sent to the user as a cookie that the server
// can track. In each request, the cookies are sent back to the server, in which it will
// then see if it has a session id that matches that unique cookie.**
// is the session data and session id there by default with cookies and did we
// add the id and username to it or is there an id already (or is it the session object
// we make below so each user will have this data when they login or signup and it will
// be used for each of the users request (the same object or))**

// cookies are basically used for sessions and to log a user out if they are
// logged in for too long with or without activity**

// cookie is a key value that the client has and a session is server side rather than
// forcing the user to send their username and password with every request
// so we store who they are to make it easier for them so they do not have to login
// for each request
// we send the username and password and we say it is tracked that we have logged in
// and we have a session_id server side so we can do the request and the session
// id is sent back each request so we know which user is changing the data
// session is persisted in the server in memeory but in domo maker C it will be persisted in
// redis and the session is an object req.session.account is what we set in account.js
// and we can put anything in there that we want to keep track of the user
// toAPI takes the account and stores the data and that gets put into the session
// and when someone connects we can look at their req.session.account._id and it allows
// us to ties their data to the session id

// Cookies are just key:value pairs set by the server or browser for tracking purposes.

// As such, you want to make sure you secure your cookies and refresh them over time.
// This usually means automatically logging users out or just sending them a new
// session id back sometimes. This limits how long a key is available, and how much
// time in which it could potentially be stolen. There are added protections against this
// that we will also add later.

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
// library that adds a bunch of security that is not there by default
const helmet = require('helmet');

const session = require('express-session');

// ../ means go up a folder but ./ means in the same folder right
// and / means go to the root directory right (yes)
const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Use “mongodb://127.0.0.1/DomoMaker” and the process.env.MONGODB_URI
// variable for the database connection. Node will first attempt to connect to your
// MongoDB Cloud instance (first option)**, and will fallback to your
// local Mongo instance (second option)(the link we set up from monngoDB compass right)**
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
// options as a JSON object (as shown below)
// Once it is configured, the session module will add a
// session object to every request object which can be accessed by saying
// “req.session”. This session object can be used to track and store information unique
// to that user between requests.** (is the id given or do we make that in
// account.js in models and controllers for login and signup and access that by doing
// req.session.account._id or username)**
app.use(session({
  // name of our cookie so it can be tracked in requests
  // when the browser sends requests the cookies will come as well
  // the key tells our session module which cookie to look for when
  // looking for a session cookie (we can have multiple sessions set up for)**
  // for security purposes we should use a key name
  // sessionid is the name of the id for the cookie
  // the req.session.account._id is the id from mongoDB and it's
  // from mongo
  key: 'sessionid',
  // private string used as a seed for hashing/creating unique session keys
  // this makes it so our unique session keys are different
  // from other servers using express
  // The secret can be changed to anything you want, but will invalidate
  // existing session ids (which isn’t necessarily a huge issue)
  // when we move to redis all of the sessions will be in redis even if
  // the server starts and stops (login and it gets persisted in redis and change
  // the secret then it will log us out and the session will not be persisted)
  // secret is test and if someone logs into the server and if we generate a random
  // sessionid or url and if we give them the id of 123 and we take 123
  // and we also add into it test and it gets hashed and this is now the id we send back to the
  // user and now in redis we saw the sessionid is the hashed code and when we stop the server it
  // all goes away and we change the secret to test and we restart the server and we say
  // the sessionid is 123 then we say 123 then add hello to it and it gets hashed again
  // and this is the sessionid with the server and if we see the id for the user based on
  // test it will not esxist since we changed the thing to hello and it says
  // we have not logged in correctly because of the sessionid (we have to login
  // with each new session)
  // to invalidate every sessionid we change the secret for security breaches etc.
  // since we do not use redis for now, then if we stop the server the sessions will
  // be deleted so we do not have to worry about it
  secret: 'Domo Arigato',
  // set to false tells the session library to only send the session key
  // back to the databse if it changes
  // if it were true then we would generate a lot of databse
  // requests that are unecessary (when do we set it to true)**
  // we don't normally persist sessions in servers so right now it's stateful
  // and depending on
  // inside the middlware if resave is set to true everytime the user makes a request
  // even if we do not modify we resave it in the databse and if we keep track of a lifetime
  // foreach it will be good but if we do not do resave and we do not
  // save for each
  // even if the session did not change it will save it even though the
  // session did not chance but false makes it get saved when the session is changed
  resave: false,
  // The saveUninitialized option set to false prevents us
  // from saving uninitialized sessionids to the database (if the user does not have
  // and id and this is just if there is an id and we have not done anything yet)
  // saveuninitialized says if we made the id and we have not used the id,
  // do not save it into the database and keep it locally and we do this because
  // if we are generating an id for every person that connects even if they are not logged
  // in it's a waste of space and if they have not logged in then do not
  // keep a session for them, otherwise keep the session
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
