const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    phoneNumber: {
        type: Number,
        require: true
    },
    type: {
        type: String,
        default: 'admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var User = (module.exports = mongoose.model("User", UserSchema));

module.exports.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserById = (id, callback) => {
    console.log('id', id)
    User.findById(id, callback);
};

module.exports.getUserByUsername = (username, callback) => {
    var query = { username: username };
    User.findOne(query, callback);
};

module.exports.getUserByUsernameOrEmail = (username, email, callback) => {
    var query = { $or: [{ username: username }, { email: email }] };
    User.findOne(query, callback);
};

module.exports.getUserByEmail = (email, callback) => {
    var query = { email: email };
    User.findOne(query, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};

module.exports.updateProfile = (id, user, callback) => {
    var query = { _id: id };
    User.findOneAndUpdate(query, user, { new: true }, callback);
}

module.exports.updatePassword = (id, npassword, callback) => {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(npassword, salt, function (err, hash) {
            var query = { _id: id };
            var update = { $set: { password: hash } };
            User.findOneAndUpdate(query, update, callback);
        });
    });
}


