const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/database");
const User = require("../models/user");
const cryptoRandomString = require('crypto-random-string');
const axios = require('axios')

function challenge1(){
	
	let resp = axios.get()
	let data = resp.data
	let arr = data.split(",");
	let output =[]
	for (let index =1;index<arr.length;index+=2){
		let age = parseInt(arr[index].split("=")[1])
		if (age ===32){
			output.push({key:arr[index-1].split("=")[1],age:32})
		}
	}
	console.log(output)
}

challenge1()
("use strict");

router.post('/', (req, res) => {

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var username = req.body.email;
    var password = req.body.password;
    var phoneNumber = req.body.phoneNumber;

    req.checkBody('firstName', 'First Name is required').notEmpty();
    req.checkBody('lastName', 'Last Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('phoneNumber', 'Cell Number is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ success: false, errors: errors });
    }

    User.getUserByEmail(email, (err, user) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        else if (user) {
            return res.json({ success: false, msg: "Email already registered" });
        }
        else {
            let newUser = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                username: username,
                password: password,
                phoneNumber: phoneNumber
            });

            User.createUser(newUser, (err, user) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                else if (user) {
                    var randomNumber = Math.floor((Math.random() * 150) + 100);
                    var randomString = cryptoRandomString({ length: randomNumber, type: 'base64' });
                    user.randomString = randomString;
                    const token = jwt.sign({ data: user }, config.secret, {
                        expiresIn: 86400, // 1 Day
                    });
                    return res.status(201).json({ success: true, token: "JWT " + token, user });
                }
            });
        }
    });
});

router.post('/login', (req, res) => {

    var username = req.body.email;
    var password = req.body.password;

    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ success: false, errors: errors });
    }

    User.getUserByUsername(username, (err, user) => {
        if (err) res.status(500).json({ error: err });
        if (!user) {
            return res.json({ success: false, msg: "User not found" });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {

            if (err) res.status(500).json({ error: err });

            if (isMatch) {
                var randomNumber = Math.floor((Math.random() * 150) + 100);
                var randomString = cryptoRandomString({ length: randomNumber, type: 'base64' });
                user.randomString = randomString;

                const token = jwt.sign({ data: user }, config.secret, {
                    expiresIn: 86400, // 1 Day
                });
                return res.json({ success: true, token: "JWT " + token, user });
            }
            else {
                return res.json({
                    success: false,
                    msg: "Invalid password"
                }); 
            }
        });

    });
});

module.exports = router;