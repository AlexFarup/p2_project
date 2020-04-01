const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.static('public'));

//Connection to MySQL database
// const connection = mysql.createConnection( {
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'Allan',
//     port: '3306'
// });

// connection.connect((err) => {
//     if (err) throw err;
//     console.log('Connected!');
    
// });
// var id = 2;
// connection.query(`SELECT * FROM \`Elev\` WHERE \`Id\` = ${id}`, function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });


// Adds index.html as a frontpage, when opening server
app.get('/',(req, res) =>{
    res.sendFile(__dirname + '/index.html');
});

app.get('/Opgaver/index.html',(req, res) =>{
    res.sendFile(__dirname + '/Opgaver/index.html');
});
app.get('/Opgaver/opgave.html',(req, res) =>{
    res.sendFile(__dirname + '/Opgaver/opgave.html');
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

