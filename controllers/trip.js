var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');

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