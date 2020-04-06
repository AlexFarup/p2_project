const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.static('public'));

//Connection to MySQL database
const connection = mysql.createConnection( {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Allan',
    port: '3306'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

let id = 1;
connection.query(`SELECT * FROM \`Opgaver\` WHERE \`Opgave-ID\` = ${id}`, function (err, result) {
    if (err) throw err;
    console.log(result);
});

//SELECT `Opgave-ID` FROM `Opgaver` WHERE 1


// Adds index.html as a frontpage, when opening server
app.get('/',(req, res) =>{
    res.sendFile(__dirname + '/index.html');
});
app.get('/Opgaver/opgaver.html',(req, res) =>{
    res.sendFile(__dirname + '/Opgaver/opgaver.html');
});
app.get('/Opgaver/opgavesaet.html',(req, res) =>{
    res.sendFile(__dirname + '/Opgaver/opgavesaet.html');
});
app.get('/oversigt/laereroversigt.html',(req, res) =>{
    res.sendFile(__dirname + '/oversigt/laereroversigt.html');
});
app.get('/oversigt/Oversigt.html',(req, res) =>{
    res.sendFile(__dirname + '/oversigt/Oversigt.html');
});

app.listen(3000, () => {
    console.log('Server is up and running at port 3000');
});



// Vi skal have lavet en funktion der henter opgaven ned
    // Klik på pil går videre til næste opgave

// Funktion der sender svar til database
