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
        port: environment.port,
        multipleStatements: true
    });
  
    con.connect(function(err){
        if (err) throw err;
        console.log("Connected!");

        con.query(`SELECT *
        FROM \`Opgaver\` AS opgaver
            INNER JOIN
                \`Besvarelser\` AS besvarelser
                ON opgaver.opg_Bes_ID = besvarelser.Besvarelse_ID
                INNER JOIN
                \`Type_opgave\` AS topgave
                on opgaver.opg_Type_ID = Type_ID
            WHERE
                opgaver.Opgave_ID = ${opgavenummer}`,
                function (err, result, fields) {

                    if (err) throw err;
                    console.log(result[0]);
                    res.render('opgaver', {  
                        opgavebeskrivelse: result[0].opg_Opgave,
                        opgave_ID: result[0].Opgave_ID,
                        besvarelse_svar: result[0].Besv_Svar,
                        forventet_svar: result[0].opg_Forv_svar,
                        hint_score: result[0].hint_score,
                        hintpoint: result[0].Besv_Hint,
                        hintforklaring: result[0].hint,
                        forventet_tid: result[0].opg_Forv_tid,
                    });
                }); 
    });
});



router.post('/sendA/:opgavenummer', function (req, res) {
    console.log(req.body);

    let svar = req.body.svar;
    let opgavenummer = req.params.opgavenummer;
    let mysql = require('mysql');
    let forventet_svar = req.body.forventet_svar;
    let hintpoint = req.body.hint_point;
    let tid_score = req.body.tidbrugt;
    let forventet_tid = req.body.forventet_tid;


    let con = mysql.createConnection({
        host: environment.host,
        user: environment.user,
        password: environment.password,
        database: environment.database,
        port: environment.port,
        multipleStatements: true
    });

 
    con.connect(function (err) {
        if (err) throw err;
        console.log(tid_score, forventet_tid);

        
        if (parseInt(`${svar}`) == parseInt(forventet_svar)){
            score = 100;
            
            if (hintpoint == 1 && parseInt(tid_score) < parseInt(forventet_tid)){
            score = score/2;
            }

            if (hintpoint == 1 && parseInt(tid_score) > parseInt(forventet_tid)){
            score = score/4;
            }

            if (hintpoint == 0 && parseInt(tid_score) > parseInt(forventet_tid)){
            score = score/2;
            }

            if (hintpoint == 0 && parseInt(tid_score) < parseInt(forventet_tid)){
            score = 100;
            }
        
        }else{
            score = 0;
        }

        let sql = `UPDATE \`Besvarelser\` SET \`Besv_Score\` = ${score}, \`Besv_Svar\` = ${svar},
                  \`Besv_Besvaret\` = 1, \`Besv_Hint\` = ${hintpoint}, \`Besv_Tid\` = ${tid_score}
                   WHERE \`Besvarelse_ID\` = ${opgavenummer}`;
        
        main();

        sql += `; UPDATE \`Opgaver\` SET \`opg_svaerhedsgrad\` = ${samlingSvaerhedsGrader[opgavenummer]} 
                  WHERE \`opg_Bes_ID\` = ${opgavenummer}`;


        con.query(sql, function (err) {
            if (err) throw err;
            console.log("score = " + score, "svar = " + svar, "tid brugt = " + tid_score + "sekunder", "disse variabler er sendt til databasen" );
        });  
    });

  res.redirect(`back`);
});

//--------------------------Alex

let data = [
    [100, 10, 15], // opgave 1 svg 1

    [25, 200, 3], // opgave 2 svg 3

    [60, 100, 9], // opgave 3 svg 2

    [100, 11, 14], // opgave 4 svg 1

    [100, 9, 15], // opgave 5 svg 1

    [100, 8, 14], // opgave 6 svg 1

    [100, 10, 15], // opgave 7 svg 1

    [55, 120, 8], // opgave 8 svg 2

    [22, 200, 5], // opgave 9 svg 3

    [45, 90, 9], // opgave 10 svg 2 

    [20, 200, 4], // opgave 11 svg 3
    
    [95, 4, 14], // opgave 12 svg 1

    [100, 7, 15], // opgave 13 svg 1

    [49, 95, 7], // opgave 14 svg 2 

    [100, 8, 15], // opgave 15 svg 1 

    [15, 220, 4] // opgave 16 svg 3

];


// let kPlaceringer = let kPlaceringer
// let mindsteAfstand = let mindsteAfstand
// let dataExtremer = let dataExtremer
// let dataRaekkevidde = let dataRaekkevidde

let kPlaceringer = [];
let mindsteAfstand = [];
let dataExtremer;
let dataRaekkevidde;

let samlingSvaerhedsGrader = [];

function main(){

    mindsteAfstand.length = 0;
    kPlaceringer.length = 0;

    dataExtremer = skafDataExtremer();
    dataRaekkevidde = skafDataRaekkevidde(dataExtremer);
    kPlaceringer = initialiseringK();
    
    koer();
    svaerhedsGrad();
    
}


// Her definerer hvilke datapunkter udgøre vores extremer/grænser

function skafDataExtremer(){
    let extremer = [];

    for (let dataPunkt = 0; dataPunkt < data.length; dataPunkt++){
        let punkt = data[dataPunkt];

        // I den første if sætning kontrollere vi om extremer arrayet på den i'ete plads er defineret
        // altså om den har nogen værdi. Hvis ikke, så giver vi den en minimums og max grænse
        for (let XYZ = 0; XYZ < punkt.length; XYZ++){
            if (!extremer[XYZ]) {
                extremer[XYZ] = { min: 1000, max: 0 };
            }

            // Her definerer vi en minimumsgrænse
            if (punkt[XYZ] < extremer[XYZ].min){
                extremer[XYZ].min = punkt[XYZ];
            }

            // Her definere vi en maksimumsgrænse
            if (punkt[XYZ] > extremer[XYZ].max){
                extremer[XYZ].max = punkt[XYZ];
            }
        }
    }

    return extremer;
}

// Finder området vi kigger på i henholdsvis X og Y aksen
function skafDataRaekkevidde(extremer){
    let raekkevidde = [];

    for (let XYZ = 0; XYZ < extremer.length; XYZ++){
        raekkevidde[XYZ] = extremer[XYZ].max - extremer[XYZ].min;
    }

    return raekkevidde;
}

function initialiseringK(k){
    // Hvis k ikke har en værdi sættes den til 3,
    // da vi 3 rangeringer vi gerne vil finde
    if (k === undefined) {
        k = 3;
    }

    // Finder et X og Y koordinat til hver k punkt
    while (k > 0){
        let kPlads = [];

        // .min bruges her da vi gerne vil finde en k placering indenfor vores område
        // defineret i vores forrige funktion.
        // Havde det været max ville k blive placeret uden for vores rækkevidde,
        // da vi skalere med dataR
        for (let XYZ = 0; XYZ < dataExtremer.length; XYZ++){
            kPlads[XYZ] = dataExtremer[XYZ].min + Math.random() * dataRaekkevidde[XYZ];
        }

        kPlaceringer.push(kPlads);

        k--;
    }

  return kPlaceringer;
}

function euclids(){
    // Yderste for-løkke tager et X og Y koordinatet fra et punkt i datasæt
    for (let dataPunkt = 0; dataPunkt < data.length; dataPunkt++){
        let punkt = data[dataPunkt];
        let afstande = [];

        // Tager et k punkts koordinater og placere i letiabel
        // Dette gøres for at vi næste for-løkke kan finde afstandende mellem
        // alle datapunkterne og de 3 k clusters
        for (let kKoordinater = 0; kKoordinater < kPlaceringer.length; kKoordinater++){
            let kPlads = kPlaceringer[kKoordinater];
            let sum = 0;

            // Her findes afstanden mellem de førnævnte datapunkter og k clusters
            // Alle datapunkterne sammenlignes med et k cluster af gangen
            // Forskellen summeres op
            for (let XYZ = 0; XYZ < punkt.length; XYZ++){
                let forskel = punkt[XYZ] - kPlads[XYZ];
                forskel *= forskel;
                sum += forskel;
            }

            // Her fuldføres euclids formlen ved at tage kvadratroden af summen
            afstande[kKoordinater] = Math.sqrt(sum);
        }

        // Finder indexet på den k værdi der har den mindste afstand til punktet
        // og lægger i et array (skal bruges senere)
        mindsteAfstand[dataPunkt] = afstande.indexOf(Math.min.apply(null, afstande));  
    }
}

function flytKpunkt(){
    //Kalder euclids funktion for at finde mindsteafstanden fra hvert datapunkt til hvert k punkt
    euclids();

    // Vi tager means arrayets længde og laver sums om til et array med samme længde (Means indeholder alle de tilfældige X, Y og Z værdier for centralpunkterne)
    let summer = Array(kPlaceringer.length);
    // Vi tager means arrayets længde og laver sums om til et array med samme længde (Means indeholder alle de tilfældige X, Y og Z værdier for centralpunkterne)
    let counter = Array(kPlaceringer.length);
    let flyttet = false;

    //Vi forbereder summer til at kunne blive til et to-dimensionelt array
    //Det bliver lavet til et array med et array inden i
    for (let kKoordinater = 0; kKoordinater < kPlaceringer.length; kKoordinater++){
        
        counter[kKoordinater] = 0;

        // Her laves der plads til et X og et Y koordinat på hvert felt i
        // summer arrayet eksempel summer[[X, Y, Z], [X, Y, Z], [X, Y, Z]]
        summer[kKoordinater] = Array(kPlaceringer[kKoordinater].length);

        // For at sikre at vi ved hvilke værdier der kommer ind i summer arrayet
        // initialiseres alle felterne til 0
        // summer [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        for (let XYZ = 0; XYZ < kPlaceringer[kKoordinater].length; XYZ++){
            summer[kKoordinater][XYZ] = 0;
        }
    }

    for (let punkt_index = 0; punkt_index < mindsteAfstand.length; punkt_index++){
        //Han flytter datapunkterne over i en varibel enkeltvis ligesom ovenstående
        let punkt = data[punkt_index];
        //Han flytter indholdet fra mindsteAfstand (distancen fra datapunkt til k) over i en variabel på iterativ vis
        let k_index = mindsteAfstand[punkt_index];
        //Han vælger et k punkt af gangen og flytter over i en varibel
        let kPlads = kPlaceringer[k_index];
        //Distancen (fra datapunkt til k = mindsteAfstand = mean_index) bruges til at vælge et punkt i counts arrayet som han tæller op
        //Counts sørger for at skubbe k punkterne *****
        counter[k_index]++;

    
        //I første iteration er mean index første k punkt og dimension er X værdien
        //Lægger XYZ værdien fra datapunktet (point[dimension]) over i summer som i første iteration er 0
        for (let XYZ = 0; XYZ < kPlads.length; XYZ++){
            summer[k_index][XYZ] += punkt[XYZ];
        }
    } 

    for (let k_index = 0; k_index < summer.length; k_index++){
        //Kontrollere at alle k punkter har et datapunkt associeret med det
        if (0 === counter[k_index]){
            summer[k_index] = kPlaceringer[k_index];

            // Hvis det viser sig at et k punkt ikke har nogle datapunkter findes der en ny tilfældig placering
            for (let XYZ = 0; XYZ < dataExtremer.length; XYZ++){
                summer[k_index][XYZ] =
                dataExtremer[XYZ].min + Math.random() * dataRaekkevidde[XYZ];
            }
            continue;
        }

        // Vi itere igennem 2D arrayet i summer, hvor vi første finder gennemsnitsafstanden fra hvert k punkt til datapunktet for at vi kan flytte k punktet ind i midten af datapunkterne
        // Arrayet ville se således ud:
        // Sum [
        //  [x, y, z]
        //  [x, y, z]
        //  [x, y, z]
        //  [x, y, z]
        // ]
        for (let XYZ = 0; XYZ < summer[k_index].length; XYZ++){
            summer[k_index][XYZ] /= counter[k_index];
        }
    }

    // Hvis vores k placering er forskelligt fra vores summer, så betyder det at vores k punkt har flyttet sig
    if (kPlaceringer.toString() !== summer.toString()){
        flyttet = true;

    }

    // Hvis k punktet er forskelligt fra vores summer, betyder det at vi ikke er færdige endnu, og vores summer kan derfor blive vores nye k placeringer
    kPlaceringer = summer;

    return flyttet;
}

// Denne funktion sørger for at køre vores k-means algoritme indtil k punkterne ikke længere flytter sig
function koer(){
    let flyttet = flytKpunkt();
    if (flyttet !== false){
        koer();
    }
}

function svaerhedsGrad() { 

      //nulstiller alle elementpladser i samlingSvaerhedsgrader, da vi ikke ved hvad der er paa pladserne  
      for(let tilknyttetCentralpunk = 0; tilknyttetCentralpunk < data.length; tilknyttetCentralpunk++){
        samlingSvaerhedsGrader[tilknyttetCentralpunk] = 0;
    }

    //Koerer igennem alle centralpunkterne
    for(let centralpunkt = 0; centralpunkt  < kPlaceringer.length; centralpunkt++){
        let x = 0;
        let y = 0;
        let z = 0;
        let taeller = 0;
        let antalKoordinater = 3;
        let svaerhedsgrad = 1;


        //Tjekker centralpunkterets x, y og z-værdi ved foeste svaerhedsgrad
        if(taeller === 0){

            //Der koeres igennem x, y og z koordinaterne for hvert centralpunkt
            for(let XYZ = 0; XYZ < antalKoordinater; XYZ++){

                //Tjekker x-koordinatet
                if(XYZ === 0){
                    if(kPlaceringer[centralpunkt][XYZ]/100 >= 0.9){
                        x++;
                    } 

                //Tjekker y-koordinatet
                }else if(XYZ === 1){
                    if(kPlaceringer[centralpunkt][XYZ]/100 < 0.12){
                        y++;
                    }    
                
                //Tjekker z-koordinatet
                }else if(XYZ ===2 ){
                    if(kPlaceringer[centralpunkt][XYZ]/100 >= 0.13){
                        z++;
                    }
                }

                //Hvis har fundet 2 eller flere koordinater der passer
                if((x + y + z) === 3){
                    
                    
                    //forløkken koerer saa laenge der er daatapunkter
                    for(let tilknyttetCentralpunk = 0; tilknyttetCentralpunk < data.length; tilknyttetCentralpunk++){

                        //Tjekker om opgaven er associeret med centralunktet
                        if(mindsteAfstand[tilknyttetCentralpunk] === centralpunkt){

                            //Skubber svarhedsgraden op, hvis ovenstaaende passer 
                            samlingSvaerhedsGrader[tilknyttetCentralpunk] = svaerhedsgrad;

                            //taeller taelles op, saa der ikke bliver tjekket for flere svaerhedsgrader
                            taeller++;
                        }
                    }
                } 
            }  
        }

     
        //Tjekker centralpunkterets x, y og z-værdi ved naeste svaerhedsgrad
        if(taeller === 0) {

            //Taeller svaerhedsgraden op, så der nu tjekkes for svarhedsgrad 2
            svaerhedsgrad++;

            //Der koeres igennem x, y og z koordinaterne for hvert centralpunkt
            for(let XYZ = 0; XYZ < antalKoordinater; XYZ++){

                //Tjekker x-koordinatet
                if(XYZ === 0){
                    if(kPlaceringer[centralpunkt][XYZ]/100 >= 0.25 && kPlaceringer[centralpunkt][XYZ]/100 <= 0.6){
                        x++;
                    } 

                //Tjekker y-koordinatet
                }else if(XYZ === 1){
                    if(kPlaceringer[centralpunkt][XYZ]/100 >= 0.9 && kPlaceringer[centralpunkt][XYZ]/100 < 1.6){
                        y++;
                    }

                //Tjekker z-koordinatet
                }else if (XYZ === 2){
                    if(kPlaceringer[centralpunkt][XYZ]/100 >= 0.7 && kPlaceringer[centralpunkt][XYZ]/100 <= 1){
                        z++;
                    }
                }
                //Hvis har fundet 2 eller flere koordinater der passer
                if((x + y + z) === 3){

                    //forløkken koerer saa laenge der er daatapunkter
                    for(let tilknyttetCentralpunk = 0; tilknyttetCentralpunk < data.length; tilknyttetCentralpunk++){

                        //Tjekker om opgaven er associeret med centralunktet
                        if(mindsteAfstand[tilknyttetCentralpunk] === centralpunkt){

                            //Skubber svarhedsgraden op, hvis ovenstaaende passer 
                            samlingSvaerhedsGrader[tilknyttetCentralpunk] = svaerhedsgrad;

                            //taeller taelles op, saa der ikke bliver tjekket for flere svaerhedsgrader
                            taeller++;
                        }
                    }
                }
            }    
        }
                
   
      
        //Tjekker centralpunkterets x, y og z-værdi ved naeste svaerhedsgrad
        if(taeller === 0) {

            //Taeller svaerhedsgraden op, så der nu tjekkes for svarhedsgrad 3
            svaerhedsgrad++;

           

            //forløkken koerer saa laenge der er daatapunkter
            for(let tilknyttetCentralpunk = 0; tilknyttetCentralpunk < data.length; tilknyttetCentralpunk++){

                //Tjekker om opgaven er associeret med centralunktet
                if(mindsteAfstand[tilknyttetCentralpunk] === centralpunkt){

                    //Skubber svarhedsgraden op, hvis ovenstaaende passer 
                    samlingSvaerhedsGrader[tilknyttetCentralpunk] = svaerhedsgrad;

                    //taeller taelles op, saa der ikke bliver tjekket for flere svaerhedsgrader
                    taeller++;
                }
            }
        }
    } 

    return samlingSvaerhedsGrader;
}


module.exports = router;
