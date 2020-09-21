const express = require('express');
const router = express.Router();

function route() {
    router.get('/', (req, res) => {
        res.send('auth');
    })

    return router;
}
module.exports = route();