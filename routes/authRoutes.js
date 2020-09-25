const express = require('express');
const passport = require('passport');
const { genPassword, validPassword } = require('../lib/passwordUtils');
const connection = require('../config/database');
const User = connection.models.User;
const router = express.Router();

function route() {
    
  //get routes
  router.get('/', (req, res) => {
        res.redirect('login');
    })

    router.get('/login', (req, res) => {
      console.log(req.session);
      const errors = req.flash().error || [];
      res.render('login', { errors });
    })

    router.get('/login-success', (req, res) => {
      res.send('login successful');
    })

    router.get('/register', (req, res) => {
      res.render('register');
    })

    router.get('/logout', (req, res) => {
      req.logout();
      res.send('You logged out');
    })

    //post routes

    router.post('/login', passport.authenticate('local', { failureRedirect: '/auth/login', failureFlash: true, successRedirect: '/auth/login-success' }));

    router.post('/register', (req, res) => {
      const saltHash = genPassword(req.body.password);

      const salt = saltHash.salt;
      const hash = saltHash.hash;

      const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt
      });

      newUser.save()
        .then((user) => {
          console.log(user);
        });

        res.redirect('/auth/login');
    })

    return router;
}
module.exports = route();