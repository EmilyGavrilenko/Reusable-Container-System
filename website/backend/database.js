const mysql = require('mysql');
require('dotenv').config()


const connection = mysql.createConnection({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

connection.connect(function (err) {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Successfully connected to the ' + process.env.DB_DATABASE + ' database');
});

module.exports = connection;