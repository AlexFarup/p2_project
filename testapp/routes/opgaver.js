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
    con.query(`SELECT * FROM \`Opgaver\` WHERE \`Opgave_ID\` = ${opgavenummer}`, function (err, result, fields) {
        if (err) throw err;
        console.log(result[0]);
        res.render('opgaver', {  
            opgavebeskrivelse: result[0].Opgave,
            opgave_ID: result[0].Opgave_ID,
            pi: result[0].Forventet_svar,
            });
      });  

  });





});

module.exports = router;
