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
                elev.Elev_ID = ${elevnummer}`, 
                function (err, result, fields) {
                     if (err) throw err;
                
                    result.forEach(element => {
                        let scoremultiplier = 0;
                        let pointgraf = 0; 
            
                        if( element.Besv_Score == 0 ){
                            scoremultiplier = 0;
                        

                        }else if(element.Besv_Score == 25){
                            scoremultiplier = 1;
                        

                        }else if( element.Besv_Score == 50 ){
                            scoremultiplier = 2;
                        

                        }else if( element.Besv_Score == 100){
                            scoremultiplier = 3;
                        }


                        if(element.opg_Forv_svaerhedsgrad == 1){
                            pointgraf += (5*scoremultiplier); 
                        
                        }else if(element.opg_Forv_svaerhedsgrad == 2){
                            pointgraf += (10*scoremultiplier); 
                        
                        }else if(element.opg_Forv_svaerhedsgrad == 3){
                            pointgraf += (13.3*scoremultiplier); 
                        }        

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


                    
                    console.log(result[0]);
                    console.log("additions point = " + (grafpoint_add), "subtraktion point = " + (grafpoint_sub), "divisions point = " + (grafpoint_div), "multiplikation point = " + (grafpoint_mul));
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
                        gp_add: grafpoint_add,
                        gp_sub: grafpoint_sub,
                        gp_div: grafpoint_div,
                        gp_mul: grafpoint_mul,
                    });
                });
    });
});



module.exports = router;

