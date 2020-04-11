var express = require('express');
var router = express.Router();
var db = require('../services/database').opgavedb;


/* GET home page. */
router.get('/:opgavenummer', function(req, res, next) {
  var opgavenummer = req.params.opgavenummer;
  var mysql = require('mysql');

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "p2gruppe",
    database: "Allan",
    port: "3306"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(`SELECT * FROM \`Elev\` WHERE \`Elev_ID\` = ${opgavenummer}`, function (err, result, fields) {
        if (err) throw err;
        console.log(result[0]);
        res.render('index', {  
            elev_ID: result[0].elev_ID,
            navn: result[0].Navn,
            elev_efternavn: result[0].Efternavn
        });
    });  
  });

});

module.exports = router;
