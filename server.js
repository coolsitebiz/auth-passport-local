

const express = require('express');
const authRouter = require('./routes/authRoutes');
const session = require('express-session');
const mongoose = require('mongoose');
const connection = require('./config/database');
const passport = require('passport');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

const MongoStore = require('connect-mongo')(session);

// Session config
const sessionStore = new MongoStore({
    mongooseConnection: connection,
    collection: 'sessions'
});
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 60 * 24 // 1 day
    }
}));

//passport init
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// EJS init
app.set('view engine', 'ejs');

// Routes
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    if (req.session.views) {
        req.session.views = req.session.views + 1;
    } else {
        req.session.views = 1;
    }
    console.log(req.session);
    res.render('index');
})

app.listen(3000, () => {
    console.log(`Listening on port ${port}`);
});