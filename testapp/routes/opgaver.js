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
    con.query(`SELECT *
    FROM \`Opgaver\` AS opgaver
        INNER JOIN
            \`Besvarelser\` AS besvarelser
            ON opgaver.opg_Bes_ID = besvarelser.Besvarelse_ID   
        WHERE
            opgaver.Opgave_ID = ${opgavenummer}`, function (err, result, fields) {

        if (err) throw err;
        console.log(result[0]);
        res.render('opgaver', {  
            opgavebeskrivelse: result[0].opg_Opgave,
            opgave_ID: result[0].Opgave_ID,
            besvarelse_svar: result[0].Besv_Svar,
          forventet_svar: result[0].opg_Forv_svar
            });
      });  
  });
});



router.post('/sendA/:opgavenummer', function (req, res) {
  console.log(req.body);
  var svar = req.body.svar;
  var opgavenummer = req.params.opgavenummer;
  var mysql = require('mysql');
 let forventet_svar = 4;
  
  var con = mysql.createConnection({
    host: environment.host,
    user: environment.user,
    password: environment.password,
    database: environment.database,
    port: environment.port,
    multipleStatements: true
  });

 

  con.connect(function (err) {
      if (err) throw err;
      console.log("connected");

      

      if (`${svar}` == forventet_svar) {
        var sql = `UPDATE \`Besvarelser\` SET \`Besv_Score\` = 1, \`Besv_Svar\` = ${svar} WHERE \`Besvarelse_ID\` = ${opgavenummer}`;
      }
      
      else  {
        var sql = `UPDATE \`Besvarelser\` SET \`Besv_Score\` = 0, \`Besv_Svar\` = ${svar} WHERE \`Besvarelse_ID\` = ${opgavenummer}`;
      }

      con.query(sql, function (err) {
          if (err) throw err;
          console.log("One record inserted");
      });  
  });
  res.redirect(`back`);
});












module.exports = router;
