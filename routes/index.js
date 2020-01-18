const express = require('express');
const router = express.Router();
const Tweets = require('../models/tweets');
const passport = require('passport');
const Users = require('../models/users');
const utils = require('../utils');

router.get('/', utils.requireLogin, (req, res) => {
  res.render('profile');
});

router.get('/edit', utils.requireLogin, (req, res) => {
   res.render('editProfile');
 });

router.get('/', (req, res) => {
    Tweets.find({}, (err, tweets) => {
      res.render('index', { tweets });
    })
  });

router.get('/login', (req, res) => {
  //res.render('login');
  Tweets.find({}, (err, tweets) => {
    res.render('login', { tweets });
  })
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/');
});

router.post('/signup', (req, res, next) => {
  const { username, password, confirmPassword } = req.body;
  if (password === confirmPassword) {
    Users.register(new Users({ username, name: username }), password, (err, user) => {
      if (err) {
        return next(err)
      }
  
      passport.authenticate('local')(req, res, () => {
        return res.redirect('/');
      });
    });
  } else {
    return next({ message: 'Password does not match' })
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;