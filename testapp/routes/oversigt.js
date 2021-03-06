const express = require('express');
const router = express.Router();
const environment = require('../enviroment').environment;
const mysql = require('mysql');


/* GET home page. */
router.get('/:elevnummer', function(req, res, next) {
    let elevnummer = req.params.elevnummer;
    let grafpoint_add = 0;
    let grafpoint_sub = 0;
    let grafpoint_div = 0;
    let grafpoint_mul = 0;

/** Connecter til database */
    let con = mysql.createConnection({
        host: environment.host,
        user: environment.user,
        password: environment.password,
        database: environment.database,
        port: environment.port,
        multipleStatements: true,
    });


    con.connect(function(err) {
        if (err) throw err;
        console.log('Connected!');

/** Henter relevant data fra database */
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
                elev.Elev_ID = ${elevnummer}`, 
                function (err, result, fields) {
                     if (err) throw err;
                
                    result.forEach(element => {
                        let scoremultiplier = 0;
                        let pointgraf = 0; 

/** Her bliver en scoremultiplier udregnet ud fra besvarelses_score */ 
                        if( element.Besv_Score === 0 ){
                            scoremultiplier = 0;
                        
                            
                        }else if(element.Besv_Score > 0 && element.Besv_Score <= 25){
                            scoremultiplier = 1;
                            
                        }else if( element.Besv_Score >= 26 && element.Besv_Score <= 50 ){
                            scoremultiplier = 2;

                        }else if( element.Besv_Score >= 51 && element.Besv_Score <= 100){
                            scoremultiplier = 3;

                        }

/**Her bliver de endelige point uddelt ud fra ens scoremultiplier og sværhedsgrad af opgave */
                        if(element.opg_svaerhedsgrad === 1){
                            pointgraf += (5*scoremultiplier); 

                        }else if(element.opg_svaerhedsgrad === 2){
                            pointgraf += (10*scoremultiplier); 

                        }else if(element.opg_svaerhedsgrad === 3){
                            pointgraf += (13.3*scoremultiplier); 

                        }        
/** Her bliver pointene sorteret i forhold til type af opgave */
                        switch(element.opg_Type_ID){
                            case 1: 
                                grafpoint_add += pointgraf;
                                break;
                            case 2: 
                                grafpoint_sub += pointgraf;
                                break;
                            case 3: 
                                grafpoint_div += pointgraf;
                                break;
                            case 4:
                                grafpoint_mul += pointgraf;
                                break;
                        }
                    });


/** Opretter array med data fra databasen*/
                    console.log(result[0]);
                    console.log('additions point = ' + (grafpoint_add), 'subtraktion point = ' + (grafpoint_sub), 'divisions point = ' + (grafpoint_div), 'multiplikation point = ' + (grafpoint_mul));
                    res.render('oversigt', {  
                        elev_ID: result[0].Elev_ID,
                        elevNavn: result[0].Elev_navn,
                        elevEfternavn: result[0].Elev_efternavn,
                        elevEmail: result[0].Elev_email,
                        laererNavn: result[0].Laerer_navn,
                        laererEfternavn: result[0].Laerer_efternavn,
                        laererTelefonnummer: result[0].Laerer_telefonnummer,
                        laererEmail: result[0].Laerer_email,
                        klasseNavn: result[0].Navn,
                        gp_add: grafpoint_add,
                        gp_sub: grafpoint_sub,
                        gp_div: grafpoint_div,
                        gp_mul: grafpoint_mul,
                    });
                });
    });
});



module.exports = router;

