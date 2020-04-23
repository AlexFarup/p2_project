var express = require('express');
var router = express.Router();
var environment = require('../enviroment').environment;


/* GET home page. */
router.get('/:opgavenummer', function(req, res, next) {
  var opgavenummer = req.params.opgavenummer;
  var mysql = require('mysql');

  var con = mysql.createConnection({
    host: environment.host,
    user: environment.user,
    password: environment.password,
    database: environment.database,
    port: environment.port
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(`SELECT * FROM \`Elev\` WHERE \`Elev_ID\` = ${opgavenummer}`, function (err, result, fields) {
        if (err) throw err;
        console.log(result[0]);
        res.render('hjaelpemidler', {  
            elev_ID: result[0].Elev_ID,
            navn: result[0].Elev_navn,
            elev_efternavn: result[0].Elev_efternavn
        });
    });  
  });

});

module.exports = router;
