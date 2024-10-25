// so models sets up the schema up for the information in the database and
// controllers works with that data and displays it with render
// and the views are the pages to display and we display them based on 
// router.js or handlebars or both**
// and the index.js for both controllers and models are used to export the other files
// from those folders to be used**
// go over all**
const mongoose = require('mongoose');
// what does this do**
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

// go over**
// this makes sure the data is the right type and length right for schemas
// the data coming in and out of the server**
// is this only when we create a new instance of the schema or how does this 
// all relate to controllers files**
const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

// this is a different toAPI than the account.js one**
// we do not use this yet will we use it eventually**
DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

// this allows us to make a Domo schema object in controllers right
// and we have to call it Domo right and what else (go over)**
const DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;
