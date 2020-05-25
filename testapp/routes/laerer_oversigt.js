const express = require('express');
const router = express.Router();
const environment = require('../enviroment').environment;


/* GET home page. */
router.get('/:opgavenummer', function(req, res, next) {
    let opgavenummer = req.params.opgavenummer;
    let mysql = require('mysql');

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

        con.getConnection(function(err) {
            if (err) throw err;
            console.log('Connected!');

            con.query(`SELECT * FROM \`Laerer\` INNER JOIN \`Klasse\` ON (\`Laerer_ID\` = \`Klasse_Laerer_ID\`)  WHERE \`Laerer_ID\` = ${opgavenummer}`, function (err, result, fields) {
                if (err) throw err;
                console.log(result[0]);
                res.render('laerer_oversigt', {  
                    laerer_navn: result[0].Laerer_navn,
                    laerer_efternavn: result[0].Laerer_efternavn,
                    laerer_telefonnummer: result[0].Laerer_telefonnummer,
                    laerer_email: result[0].Laerer_email,
                });
            });
        });
    });
});

module.exports = router;
