// Connect to the database
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: ''
});

module.exports = connection;