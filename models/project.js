'use strict';

var mongoose = require('mongoose');

/**
 * Our User Schema.
 */
let ProjectSchema = new mongoose.Schema({
  name: String,
  devices: [{type: mongoose.Schema.Types.ObjectId, ref: 'Device'}]
});

/**
 * Register the model with mongoose.
 */
mongoose.model('Project', ProjectSchema);
