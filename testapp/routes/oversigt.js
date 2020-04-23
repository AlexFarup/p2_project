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
    multipleStatements: true,
  });


  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(`SELECT *
    FROM \`Elev\` AS elev
        INNER JOIN
            \`Laerer\` AS laerer
            ON elev.Elev_laerer_ID = laerer.Laerer_ID
        INNER JOIN
            \`Klasse\` AS klasse
            ON elev.Elev_klasse_ID = klasse.Klasse_ID
        INNER JOIN
            \`Besvarelser\` AS besvarelser
            ON elev.Elev_ID = besvarelser.Besvarelse_ID   
        INNER JOIN
        \`Opgaver\` AS opgaver
          ON besvarelser.Besvarelse_ID = opgaver.Opgave_ID    
        WHERE
            elev.Elev_ID = ${opgavenummer}`, function (err, result, fields) {
      if (err) throw err;
      console.log(result[0]);
      res.render('oversigt', {  
          elev_ID: result[0].Elev_ID,
          elev_navn: result[0].Elev_navn,
          elev_efternavn: result[0].Elev_efternavn,
          elev_email: result[0].Elev_email,
          laerer_navn: result[0].Laerer_navn,
          laerer_efternavn: result[0].Laerer_efternavn,
          laerer_telefonnummer: result[0].Laerer_telefonnummer,
          laerer_email: result[0].Laerer_email,
          klasse_navn: result[0].Navn,
          opgave_ID: result[0].Opgave_ID,
          besvarelse_svar: result[0].Besv_Svar,
          forventet_svar: result[0].opg_Forv_svar
      });
    });
  });
});

router.post('/sendB/:opgavenummer', function (req, res) {
  console.log(req.body);
  var svar = req.body.svar;
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

  con.connect(function (err) {
    if (err) throw err;
    console.log("connected");

  function compare(besvarelse_svar, forventet_svar) {
    if (besvarelse_svar == forventet_svar) {
      var sql = `UPDATE \`Besvarelser\` SET \`Besv_Score\` = 1 WHERE \`Besvarelse_ID\` = opgaver.Opgave_ID`;
    }
    else
    var sql = `UPDATE \`Besvarelser\` (\`Besvarelse_ID\`, \`Besv_Tid\`, \`Besv_Svar\`, \`Besv_Hint\`, \`Besv_Score\`, \`Besv_Elev_ID\`, \`Besv_Besvaret\` ) VALUES (${opgavenummer}, '0', ${svar}, '0', '0', '1', '1')`;
  }
  console.log("records inserted");
  });
  res.redirect(`back`);

});


module.exports = router;

