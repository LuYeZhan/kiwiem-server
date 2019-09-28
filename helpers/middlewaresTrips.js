'use strict';

const createError = require('http-errors');

exports.validationFormTrip = () => (req, res, next) => {
  const place = req.body;
  if (!trip.title) {
    return next(
      createError(425)
    );
  } else if (!trip.destination) {
    return next(
      createError(426)
    );
  } else if (!trip.description) {
    return next(
      createError(427)
    );
  } else if (!trip.startDate) {
    return next(
      createError(428)
    );
  } else if (!trip.endDate) {
    return next(
      createError(429)
    );
  } else {
    next();
  }
};