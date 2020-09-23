"use strict";

var JwtStrategy = require('passport-jwt').Strategy;

var ExtractJwt = require('passport-jwt').ExtractJwt;

var User = require('../models/user');

var config = require('../config/database');

module.exports = function (passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = config.secret;
  opts.algorithms = ["HS256"];
  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    User.getUserById(jwt_payload.data._id, function (err, user) {
      if (err) {
        return done(err, false);
      }

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
};