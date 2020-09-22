if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const authRouter = require('./routes/authRoutes');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

const MongoStore = require('connect-mongo')(session);
const connection = mongoose.createConnection(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

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

app.set('view engine', 'ejs');

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