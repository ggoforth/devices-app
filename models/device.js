'use strict';

var mongoose = require('mongoose');

/**
 * Our User Schema.
 */
let DeviceSchema = new mongoose.Schema({
  name: String
});

/**
 * Register the model with mongoose.
 */
mongoose.model('Device', DeviceSchema);
