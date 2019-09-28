'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  description: {
    type: String
  },
  needs: [{
    type: String
  }],
  owner: String
},
{
  timestamps: true
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip
;
