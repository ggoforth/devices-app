'use strict';

var mongoose = require('mongoose');

/**
 * Our User Schema.
 */
let UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  projects: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}]
});

/**
 * Register the model with mongoose.
 */
mongoose.model('User', UserSchema);
