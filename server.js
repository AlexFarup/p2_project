const express = require('express');
const mysql = require('mysql');

const app = express();

//Connection to MySQL database
const connection = mysql.createConnection( {
    host: 'localhost',
    user: 'p2-projekt@hotmail.com',
    password: 'gruppe_B2-4',
    database: 'database name'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

// Adds index.html as a frontpage, when opening server
app.get('/',(req, res) =>{
    res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => {
    console.log('Server is up and running at port 3000');
});

