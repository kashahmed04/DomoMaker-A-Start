const controllers = require('./controllers');

//could we have done Domo = controllers.Domo; and Account = controllers.Account 
//do we need the {} when defining variables or no because otherwise the variable
//is not blue and it's green instead**

const router = (app) => {
  // these two GET and POST requests are responsible for getting the login or signup page for
  // the user and posting what they put in to allow them to login or signup
  app.get('/login', controllers.Account.loginPage);
  app.post('/login', controllers.Account.login);

  app.get('/signup', controllers.Account.signupPage);
  app.post('/signup', controllers.Account.signup);

  // gives the user the logout page
  app.get('/logout', controllers.Account.logout);

  // this the page to the user to be able to create the character 
  app.get('/maker', controllers.Domo.makerPage);

  // It will call the Domo Controller’s make function 
  app.post('/maker', controllers.Domo.makeDomo);

  // default case
  app.get('/', controllers.Account.loginPage);

  // are we not making a /* for GET or POST
  // in project 2, we set up a 404 page instead for a default case (by using handlebars to make the
  // page then have he default case)
  // we are not using any HEAD requests right even though GET handles HEAD requests
};

module.exports = router;
