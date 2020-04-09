const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')

//User model
const User = require('../models/User');

//LOGIN
router.get('/login', (req,res) => res.render('login'));

//REGISTER
router.get('/register', (req,res) => res.render('register'));

//REGISTER
router.post('/register', (req,res) => {
    const {name, email, password, password2} = req.body;
    let errors = []

    //Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all fields" });
    }

    //Check passwords match
    if (password != password2) {
        errors.push({ msg: "Passwords do not match" });
    }

    //Check passwords length
    if (password.length < 6) {
        errors.push({ msg: "Passwords too short, should be at least 6 characters" });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password
        })
    } else {
        //VALIDATION PASSED
        User.findOne({ email:email })
            .then(user => {
                if(user) {
                    //User exists
                    errors.push({ msg: 'Email already exists!'})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    //HASH PASSWORD
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            //Password=Hashed Password
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Registered Successfully')
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                    }))
                }
            });
    }
});

//LOGIN HANDLE
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/experiments',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//LOGOUT HANDLE
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');
});

module.exports = router;