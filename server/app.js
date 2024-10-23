// why is connection string not working on mongoDB compass and heroku for submission**
// it is still putting the simple models assignment on mongoDB compass**
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
