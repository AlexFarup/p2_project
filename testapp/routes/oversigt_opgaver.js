const express = require('express');
const router = express.Router();
const environment = require('../enviroment').environment;


/* GET home page. */
router.get('/:opgavenummer', function(req, res, next) {
    let opgavenummer = req.params.opgavenummer;
    let mysql = require('mysql');

    let con = mysql.createConnection({
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

            res.render('oversigt_opgaver', { 
                title: 'Opgaversæt', 
                opgavebeskrivelse: result[0].Opgave,
                opgave_ID: result[0].Opgave_ID,
            });
        });  
    });
});

module.exports = router;


