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
            
            });
      });  

  });

});


router.post('/sendA/:opgavenummer', function (req, res) {
  console.log(req.body);
  var svar = req.body.svar;
  var opgavenummer = req.params.opgavenummer;
  var mysql = require('mysql');

  
  var con = mysql.createConnection({
    host: environment.host,
    user: environment.user,
    password: environment.password,
    database: environment.database,
    port: environment.port
  });


  con.connect(function (err) {
      if (err) throw err;
      console.log("connected");

      var sql = `INSERT INTO \`Besvarelser\` (\`Besvarelse_ID\`, \`Tid\`, \`svar\`, \`Elev_ID\`) VALUES (${opgavenummer}, '0', ${svar}, '1')`;
      con.query(sql, function (err) {
          if (err) throw err;
          console.log("One record inserted");
      });
  });
  res.redirect(`back`);
});


module.exports = router;
