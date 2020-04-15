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
          klasse_navn: result[0].Navn
      });
    });
  });
});

module.exports = router;



//con.query(`SELECT * FROM \`Elev\` INNER JOIN \`Laerer\` ON (\`Klasse_ID\` = \`Laerer_ID\`)  WHERE \`Elev_ID\` = ${opgavenummer}`, function (err, result, fields) {

 

//`SELECT \`Elev_ID\`, \`Elev_navn\`, \`Elev_efternavn\`, \`Elev_username\`, \`Elev_password\`, \`Elev_email\`, \`Elev_klasse_ID, \`Elev_laerer_ID\`, \`Klasse_ID\`, \`Klasse_Navn\`, \`Laerer_ID\`, \`Laerer_navn\`, \`Laerer_efternavn\`, \`Laerer_password\`, \`Laerer_username\`, \`Laerer_email\`, \`Laerer_telefonnummer\` FROM ((\`Elev\` INNER JOIN \`Klasse\` ON \`Elev.Elev_Klasse_ID\` = \`Klasse.Klasse_ID\`) INNER JOIN \`Laerer\` ON \`Elev.Elev_laerer_ID\` = \`Laerer.Laerer_ID\`) WHERE \`Elev_ID\` = ${opgavenummer}`, function (err, result, fields

