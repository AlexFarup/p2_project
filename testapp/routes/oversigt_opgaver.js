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
    password: "",
    database: "Allan",
    port: "3306"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(`SELECT * FROM \`Opgaver\` WHERE \`Opgave_ID\` = ${opgavenummer}`, function (err, result, fields) {
        if (err) throw err;
        console.log(result[0]);
        res.render('oversigt_opgaver', { 
            title: 'Opgaversæt', 
            opgavebeskrivelse: result[0].Opgave,
            opgave_ID: result[0].Opgave_ID,
            });
      });  

  });


});

module.exports = router;


