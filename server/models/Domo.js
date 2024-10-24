
//so models sets up the schema up for the information in the database and
//controllers works with that data and displays it with render 
//and the views are the pages to display and we display them based on router.js**
//and the index.js for both controllers and models are used to export the other files
//from those folders to be used**
//go over all**
const mongoose = require('mongoose');
//what does this do**
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

//go over**
//this makes sure the data is the right type and length right for schemas
//the data coming in and out of the server**
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

//this is a different toAPI than the account.js one**
DomoSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    age: doc.age,
});

const DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;