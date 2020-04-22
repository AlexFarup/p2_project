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
    port: environment.port,
    multipleStatements: true
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(`SELECT * FROM \`Opgaver\` WHERE \`Opgave_ID\` = ${opgavenummer}`, function (err, result, fields) {
        if (err) throw err;
        console.log(result[0]);
        res.render('opgaver', {  
            opgavebeskrivelse: result[0].opg_Opgave,
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

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(`SELECT *
    FROM \`Opgaver\` AS opgaver
        INNER JOIN
            \`Besvarelser\` AS besvarelser
            ON opgaver.Opgave_ID = besvarelser.Besvarelse_ID   
        WHERE
            opgaver.Opgave_ID = ${opgavenummer}`, function (err, result, fields) {
      if (err) throw err;
      console.log(result[0]);
      res.render('oversigt', {  
     
      });
    });
  });





  con.connect(function (err) {
      if (err) throw err;
      console.log("connected");

      var sql = `INSERT INTO \`Besvarelser\` (\`Besvarelse_ID\`, \`Besv_Tid\`, \`Besv_Svar\`, \`Besv_Hint\`, \`Besv_Score\`, \`Besv_Elev_ID\`, \`Besv_Besvaret\` ) VALUES (${opgavenummer}, '0', ${svar}, '0', '0', '1', '0')`;
      con.query(sql, function (err) {
          if (err) throw err;
          console.log("One record inserted");
      });
  });
  res.redirect(`back`);
});


module.exports = router;
