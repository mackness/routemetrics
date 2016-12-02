const _ = require('lodash');
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');

/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  res.render('trips', {
    title: 'User Trips'
  });
};

/**
 * POST /trip
 * Save a users trip.
 */
exports.postTrip = function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }

    user.trips.push({
      _id: user.trips.length + 1,
      date: req.body.date,
      route: req.body.route || 0,
      distance: req.body.distance || 0
    })

    user.save(function(err) {
      if (err) {
        return next(err);
      }
      res.send('success');
    });
  });
};

/**
 * DELETE /trip
 * Save a users trip.
 */
exports.deleteTrip = function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }

    user.trips.forEach(function(trip, i) {
      if (req.params.tripid == trip._id) {
        user.trips.splice(i, 1);
        console.log(user.trips.splice(i, 1))
      }
    })

    user.save(function(err) {
      if (err) {
        return next(err);
      }
      res.send('success');
    });
  });
};





