const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mysql = require('mysql');

var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'selfshare',
   password : 'xs6HZKdc5YEi6',
   database : 'selfshare'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results) {
   if (error) throw error;
   console.log('The solution is: ', results[0].solution);
});

connection.end();

app.listen(port, () => console.log(`Example App running on http://localhost:${port}/`));

app.get('/', (req, res) =>
{
   res.send("hello worldssss");
});
