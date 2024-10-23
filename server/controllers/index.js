// Remember that this file gets automatically imported when the folder is imported.
// Since we know this, we will make this file pull in other files we want in public scope.
// since in router.js it has access to index.js since we called just the controllers folder and
// also gets access to the files we call in this file as well**
// do we just say controllers. the name of the file we want to use and
// the function then (Ex.in router.js we have controllers.Account.loginPage to go to the account
// file from index.js in controllers, then access that specific function)**
// We will pull in Account and Domo from the controllers folder since
// router does not have access to them since the default for calling the folder
// only gives the index.js from controllers**

// does the .Account allow us to access this file by .Account in router.js**
// these are the files from the controllers
// folder right because we use ./ for the same folder right**
module.exports.Account = require('./Account.js');
module.exports.Domo = require('./Domo.js');
