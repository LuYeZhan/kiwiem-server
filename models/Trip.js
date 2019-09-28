'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const tripSchema = new Schema({
  from: {
    type: String,
    required: true
  },
  to: {
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
  owner: String,
  request: {
    type: [ObjectId],
    user: 'User'
  },
  img: {
    type: String
  }
},

{
  timestamps: true
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip
;
