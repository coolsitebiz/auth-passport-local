const express = require('express');
const authRouter = require('./routes/authRoutes');
const app = express();

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.render('index');
})

app.listen(3000, () => {
    console.log(`Listening on port ${port}`);
});