const express = require('express');
const router = express.Router();
const environment = require('../enviroment').environment;


/* GET home page. */
router.get('/:opgavenummer', function(req, res, next) {
    let opgavenummer = req.params.opgavenummer;
    let mysql = require('mysql');

/** Connecter til database */
    let con = mysql.createConnection({
        host: environment.host,
        user: environment.user,
        password: environment.password,
        database: environment.database,
        port: environment.port
    });
/** Henter data fra database */
    con.connect(function(err){
        if (err) throw err;
        console.log('Connected!');
        con.query(`SELECT * FROM \`Elev\` WHERE \`Elev_ID\` = ${opgavenummer}`, function (err, result, fields) {
            if (err) throw err;
            console.log(result[0]);
            
/** Opretter array med data fra databasen*/
            res.render('index', {  
                elev_ID: result[0].Elev_ID,
                navn: result[0].Elev_navn,
                elev_efternavn: result[0].Elev_efternavn
            });
        });  
    });
});

module.exports = router;
