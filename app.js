const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const mysql      = require('mysql');

// mysql
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'tiger',
  database : 'matcha'
});

db.connect(function (err) {
  if (err) throw err;
  console.log('Connected to database');
});

global.db = db;

// config EJS template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./router/index'));
//app.use('/home', require('./router/home'));

// Run app on port 5000
const PORT = 5000;
app.listen(PORT);
