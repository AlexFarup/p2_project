const express = require('express');
const router = express.Router();
const environment = require('../enviroment').environment;


/* GET home page. */
router.get('/:opgavenummer', function(req, res, next) {
    let opgavenummer = req.params.opgavenummer;
    let mysql = require('mysql');

/** Connecter til database */
    let con = mysql.createPool({
        connectionLimit: 10,
        host: environment.host,
        user: environment.user,
        password: environment.password,
        database: environment.database,
        port: environment.port,
        multipleStatements: true,
    });

        con.getConnection(function(err) {
            if (err) throw err;
            console.log('Connected!');

/** Henter data fra database */
            con.query(`SELECT * FROM \`Laerer\` INNER JOIN \`Klasse\` ON (\`Laerer_ID\` = \`Klasse_Laerer_ID\`)  WHERE \`Laerer_ID\` = ${opgavenummer}`, function (err, result, fields) {
                if (err) throw err;
                console.log(result[0]);
    
/** Opretter array med data fra databasen og sender det til html-siden */
                res.render('laerer_oversigt', {  
                    laererNavn: result[0].Laerer_navn,
                    laererEfternavn: result[0].Laerer_efternavn,
                    laererTelefonnummer: result[0].Laerer_telefonnummer,
                    laererEmail: result[0].Laerer_email,
                });
            });
        });
   
});

module.exports = router;
