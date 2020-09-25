const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const { validPassword } = require('../lib/passwordUtils');
const User = connection.models.User;

const customFields = {
    usernameField: 'username',
    passwordField: 'password'
}

// make async await later in try/catch
const verifyCallback = (username, password, done) => {
    User.findOne({ username: username })
        .then((user) => {
            if (!user) { 
                console.log('user not found');    
                return done(null, false); 
            };
            console.log('validating user...');
            //change to bcrypt later
            const isValid = validPassword(password, user.hash, user.salt);

            if (isValid) {
                console.log('user is valid');
                return done(null, user);
            } else {
                console.log('user not valid');
                return done(null, false);
            }
        })
        .catch((err) => {
            done(err);
        });

}

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});