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
            ON elev.Elev_ID = besvarelser.Besv_Elev_ID   
        INNER JOIN
        \`Opgaver\` AS opgaver
          ON besvarelser.Besvarelse_ID = opgaver.Opgave_ID    
        WHERE
            elev.Elev_ID = ${opgavenummer}`, function (err, result, fields) {
      if (err) throw err;
      console.log(result[0]);
      res.render('oversigt', {  
         
          elev_navn: result[0].Elev_navn,
          elev_efternavn: result[0].Elev_efternavn,
          elev_email: result[0].Elev_email,
          laerer_navn: result[0].Laerer_navn,
          laerer_efternavn: result[0].Laerer_efternavn,
          laerer_telefonnummer: result[0].Laerer_telefonnummer,
          laerer_email: result[0].Laerer_email,
          klasse_navn: result[0].Navn,
      });
    });
  });
});




module.exports = router;

