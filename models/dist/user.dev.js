"use strict";

var mongoose = require("mongoose");

var bcrypt = require("bcryptjs");

var UserSchema = mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  username: {
    type: String
  },
  password: {
    type: String
  },
  phoneNumber: {
    type: Number,
    require: true
  },
  type: {
    type: String,
    "default": 'admin'
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
var User = module.exports = mongoose.model("User", UserSchema);

module.exports.createUser = function (newUser, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.getUserById = function (id, callback) {
  console.log('id', id);
  User.findById(id, callback);
};

module.exports.getUserByUsername = function (username, callback) {
  var query = {
    username: username
  };
  User.findOne(query, callback);
};

module.exports.getUserByUsernameOrEmail = function (username, email, callback) {
  var query = {
    $or: [{
      username: username
    }, {
      email: email
    }]
  };
  User.findOne(query, callback);
};

module.exports.getUserByEmail = function (email, callback) {
  var query = {
    email: email
  };
  User.findOne(query, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};