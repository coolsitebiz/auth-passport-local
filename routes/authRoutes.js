const express = require('express');
const passport = require('passport');
const { genPassword, validPassword } = require('../lib/passwordUtils');
const strongPass = require('../lib/passValidator');
const connection = require('../config/database');
const User = connection.models.User;
const { isAuth } = require('../lib/authUtils');
const { isAdmin } = require('../lib/authUtils');
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

    router.get('/protected-route', isAuth, (req, res) => {
      res.send('You have reached the protected route');
    })

    router.get('/admin-route', isAdmin, (req, res) => {
      res.send('You have reached the admin route');
    })

    router.get('/logout', (req, res) => {
      req.logout();
      res.send('You logged out');
    })

    //post routes

    router.post('/login', passport.authenticate('local', { failureRedirect: '/auth/login', failureFlash: true, successRedirect: '../dashboard' }));

    router.post('/register', (req, res) => {
      if (!strongPass(req.body.password)) {
        return res.json({ err: 'weak password'});
      };
      const saltHash = genPassword(req.body.password);

      const salt = saltHash.salt;
      const hash = saltHash.hash;

      const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt,
        admin: false
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