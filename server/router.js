const controllers = require('./controllers');

const router = (app) => {
  // these two GET and POST requests are responsible for getting the login or signup page for
  // the user and posting what they put in to allow them to login or signup**
  app.get('/login', controllers.Account.loginPage);
  app.post('/login', controllers.Account.login);

  app.get('/signup', controllers.Account.signupPage);
  app.post('/signup', controllers.Account.signup);

  // gives the user the logout page**
  app.get('/logout', controllers.Account.logout);

  // this only gives the page to the user to be able to create the character (no POST request)**
  app.get('/maker', controllers.Domo.makerPage);

  // It will call the Domo Controller’s make function (which we have not made yet).
  app.post('/maker', controllers.Domo.makeDomo);

  // default case**
  app.get('/', controllers.Account.loginPage);

  // are we not making a /* for GET or POST**
  // we are not using any HEAD requests right even though GET handles HEAD requests**
};

module.exports = router;
