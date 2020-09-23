/* eslint-disable no-undef */
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  database: 'mongodb://localhost:27017/testApp',
  secret: process.env.SECRET_KEY,
  port: process.env.PORT
}