const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('dotenv').config();

const conn = process.env.DB_STRING;

const connection = mongoose.createConnection(conn, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = new Schema({
  username: String,
  hash: String,
  salt: String,
  admin: Boolean
});

const User = connection.model('User', UserSchema);

module.exports = connection;