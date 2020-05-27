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
        port: environment.port,
        multipleStatements: true
    });

/** Henter data fra database */
    con.connect(function(err){
        if (err) throw err;
        console.log('Connected!');

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

/** Opretter array med data fra databasen*/
                    if (err) throw err;
                    console.log(result[0]);

/** Opretter array med data fra databasen og sender det til html-siden */
                    res.render('opgaver', {  
                        opgavebeskrivelse: result[0].opg_Opgave,
                        opgave_ID: result[0].Opgave_ID,
                        besvarelseSvar: result[0].Besv_Svar,
                        forventetSvar: result[0].opg_Forv_svar,
                        hintScore: result[0].hint_score,
                        hintPoint: result[0].Besv_Hint,
                        hintForklaring: result[0].hint,
                        forventetTid: result[0].opg_Forv_tid,
                    });
                }); 
    });
});



router.post('/sendA/:opgavenummer', function (req, res) {
    console.log(req.body);

    let svar = req.body.svar;
    let opgavenummer = req.params.opgavenummer;
    let mysql = require('mysql');
    let forventetSvar = req.body.forventetSvar;
    let hintPoint = req.body.hintPoint;
    let tid_score = req.body.tidbrugt;
    let forventetTid = req.body.forventetTid;


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
        console.log(tid_score, forventetTid);

        /** Her bliver en besvarelses score udregnet, den bliver = 100% når man har svaret rigtigt */
        if (parseInt(`${svar}`) === parseInt(forventetSvar)){
            score = 100;
        /** Scoren bliver herefter divideret alt efter om man er gået over tid, eller har benyttet sig af hint */
            if (hintPoint === 1 && parseInt(tid_score) < parseInt(forventetTid)){
            score = score/2;
            }

            if (hintPoint === 1 && parseInt(tid_score) > parseInt(forventetTid)){
            score = score/4;
            }

            if (hintPoint === 0 && parseInt(tid_score) > parseInt(forventetTid)){
            score = score/2;
            }

            if (hintPoint === 0 && parseInt(tid_score) < parseInt(forventetTid)){
            score = 100;
            }
        
        }else{
            score = 0;
        }
        /** Når scoren er udregnet bliver svaret, tiden brugt, og en indikator for om man har brugt hint eller ej, sendt til databasen */
        let sql = `UPDATE \`Besvarelser\` SET \`Besv_Score\` = ${score}, \`Besv_Svar\` = ${svar},
                  \`Besv_Besvaret\` = 1, \`Besv_Hint\` = ${hintPoint}, \`Besv_Tid\` = ${tid_score}
                   WHERE \`Besvarelse_ID\` = ${opgavenummer}`;
        /** K means algoritmen kører når man har indsendt sit svar */
        let samlingSvaerhedsGrader = kMeansUdregning();
        console.log(samlingSvaerhedsGrader);
        /** Her bliver k means resultatet pushet til databasen */
        sql += `; UPDATE \`Opgaver\` SET \`opg_svaerhedsgrad\` = ${samlingSvaerhedsGrader[opgavenummer - 1]} 
                  WHERE \`opg_Bes_ID\` = ${opgavenummer}`;


        con.query(sql, function (err) {
            if (err) throw err;
            console.log('score = ' + score, 'svar = ' + svar, 'tid brugt = ' + tid_score + 'sekunder', 'disse variabler er sendt til databasen' );
        });  
    });

  res.redirect(`back`);
});

//--------------------------Alex

let data = [
    [1, 0.01, 1], // opgave 1 svg 1
  
    [0.30, 2.15, 0.26], // opgave 2 svg 3
  
    [0.46, 0.75, 0.75], // opgave 3 svg 2
  
    [1, 0.11, 1], // opgave 4 svg 1
  
    [1, 0.09, 0.95], // opgave 5 svg 1
  
    [1, 0.08, 1], // opgave 6 svg 1
  
    [1, 0.10, 1], // opgave 7 svg 1
  
    [0.55, 1.20, 0.70], // opgave 8 svg 2
  
    [0.22, 2.00, 0.25], // opgave 9 svg 3
  
    [0.55, 0.90, 0.70], // opgave 10 svg 2 
  
    [0.20, 2.00, 0.25], // opgave 11 svg 3
    
    [0.95, 0.04, 0.95], // opgave 12 svg 1
  
    [1, 0.07, 1], // opgave 13 svg 1
  
    [0.50, 0.95, 0.65], // opgave 14 svg 2 
  
    [1, 0.08, 1], // opgave 15 svg 1 
  
    [0.15, 2.20, 0.20] // opgave 16 svg 3
  
  ];
  
  
 
  function kMeansUdregning(){
      
    
    let dataExtremer = skafDataExtremer();
    let dataRaekkevidde = skafDataRaekkevidde(dataExtremer);
    let kPlaceringer = initialiseringK(3, dataRaekkevidde, dataExtremer);
    
    return erPunktetFlyttet(kPlaceringer, dataExtremer, dataRaekkevidde);
    
    
  };
  
  
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
  function skafDataRaekkevidde(dataExtremer){
    let raekkevidde = [];
  
    for (let XYZ = 0; XYZ < dataExtremer.length; XYZ++){
        raekkevidde[XYZ] = dataExtremer[XYZ].max - dataExtremer[XYZ].min;
    }
  
    return raekkevidde;
  }
  
  function initialiseringK(k, dataRaekkevidde, dataExtremer){
    let kPlaceringer = [];
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
  
  function euclids(mindsteAfstand, kPlaceringer){
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
  
  function flytKpunkt(kPlaceringer, dataExtremer, dataRaekkevidde){
    let mindsteAfstand = [];
    //Kalder euclids funktion for at finde mindsteafstanden fra hvert datapunkt til hvert k punkt
    euclids(mindsteAfstand, kPlaceringer);
    
    // Vi tager means arrayets længde og laver sums om til et array med samme længde (Means indeholder alle de tilfældige X, Y og Z værdier for centralpunkterne)
    let summer = Array(kPlaceringer.length);
    // Vi tager means arrayets længde og laver sums om til et array med samme længde (Means indeholder alle de tilfældige X, Y og Z værdier for centralpunkterne)
    let taeller = Array(kPlaceringer.length);
    let flyttet = false;
  
    //Vi forbereder summer til at kunne blive til et to-dimensionelt array
    //Det bliver lavet til et array med et array inden i
    for (let kKoordinater = 0; kKoordinater < kPlaceringer.length; kKoordinater++){
        
        taeller[kKoordinater] = 0;
  
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
        //Distancen (fra datapunkt til k = mindsteAfstand = mean_index) bruges til at vælge et punkt i counts arrayet som han taeller op
        //Counts sørger for at skubbe k punkterne *****
        taeller[k_index]++;
  
    
        //I første iteration er mean index første k punkt og dimension er X værdien
        //Lægger XYZ værdien fra datapunktet (point[dimension]) over i summer som i første iteration er 0
        for (let XYZ = 0; XYZ < kPlads.length; XYZ++){
            summer[k_index][XYZ] += punkt[XYZ];
        }
    } 
  
    for (let k_index = 0; k_index < summer.length; k_index++){
        //Kontrollere at alle k punkter har et datapunkt associeret med det
        if (0 === taeller[k_index]){
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
            summer[k_index][XYZ] /= taeller[k_index];
        }
    }
  
    // Hvis vores k placering er forskelligt fra vores summer, så betyder det at vores k punkt har flyttet sig
    if (kPlaceringer.toString() !== summer.toString()){
        flyttet = true;
  
    }
  
    // Hvis k punktet er forskelligt fra vores summer, betyder det at vi ikke er færdige endnu, og vores summer kan derfor blive vores nye k placeringer
    kPlaceringer = summer;
  
    let slutteligeVaerdier = {
      flyttet: flyttet,
      mindsteAfstand: mindsteAfstand,
      kPlaceringer: kPlaceringer
    };
    
    
    return slutteligeVaerdier;
  }
  
  // Denne funktion sørger for at køre vores k-means algoritme indtil k punkterne ikke længere flytter sig
  function erPunktetFlyttet(kPlaceringer, dataExtremer, dataRaekkevidde){
      
    let slutteligeVaerdier = flytKpunkt(kPlaceringer, dataExtremer, dataRaekkevidde);
    
    if (slutteligeVaerdier.flyttet !== false){
        kPlaceringer = slutteligeVaerdier.kPlaceringer;
        
       return erPunktetFlyttet(kPlaceringer, dataExtremer, dataRaekkevidde);    
    }
    // Den sidste if forhindre den rekursive funktion i at foresætte
    if(slutteligeVaerdier.flyttet === false) {
       return svaerhedsGrad(slutteligeVaerdier.kPlaceringer, slutteligeVaerdier.mindsteAfstand);
        
    }
    
  }
  
  function svaerhedsGrad(kPlaceringer, mindsteAfstand) { 
    let samlingSvaerhedsGrader = [];
    
    
    //nulstiller alle elementpladser i samlingSvaerhedsgrader, da vi ikke ved hvad der er paa pladserne  
    for(let tilknyttetCentralpunkt = 0; tilknyttetCentralpunkt < data.length; tilknyttetCentralpunkt++){
        samlingSvaerhedsGrader[tilknyttetCentralpunkt] = 0;
    }
  
    //Koerer igennem alle centralpunkterne
    for(let centralpunkt = 0; centralpunkt  < kPlaceringer.length; centralpunkt++){
        let x = 0;
        let y = 0;
        let z = 0;
        let taeller = 0;
        let antalKoordinater = 3;
        let svaerhedsgrad = 1;
  
  
        //Tjekker centralpunkterets x, y og z-værdi ved foerste svaerhedsgrad
        if(taeller === 0){
  
            //Der koeres igennem x, y og z koordinaterne for hvert centralpunkt
            for(let XYZ = 0; XYZ < antalKoordinater; XYZ++){
  
                //Tjekker x-koordinatet
                if(XYZ === 0){
                    if(kPlaceringer[centralpunkt][XYZ] >= 0.9){
                        x++;
                    } 
  
                //Tjekker y-koordinatet
                }else if(XYZ === 1){
                    if(kPlaceringer[centralpunkt][XYZ] < 0.12){
                        y++;
                    }    
                
                //Tjekker z-koordinatet
                }else if(XYZ === 2 ){
                    if(kPlaceringer[centralpunkt][XYZ] >= 0.90){
                        z++;
                    }
                }
  
                //Hvis har fundet 2 eller flere koordinater der passer
                if((x + y + z) === 3){
                    
                    
                    //forløkken koerer saa laenge der er daatapunkter
                    for(let tilknyttetCentralpunkt = 0; tilknyttetCentralpunkt < data.length; tilknyttetCentralpunkt++){
  
                        //Tjekker om opgaven er associeret med centralunktet
                        if(mindsteAfstand[tilknyttetCentralpunkt] === centralpunkt){
  
                            //Skubber svarhedsgraden op, hvis ovenstaaende passer 
                            samlingSvaerhedsGrader[tilknyttetCentralpunkt] = svaerhedsgrad;
  
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
                    if(kPlaceringer[centralpunkt][XYZ] >= 0.40 && kPlaceringer[centralpunkt][XYZ] <= 0.89){
                        x++;
                    } 
  
                //Tjekker y-koordinatet
                }else if(XYZ === 1){
                    if(kPlaceringer[centralpunkt][XYZ] >= 0.12 && kPlaceringer[centralpunkt][XYZ] <= 1){
                        y++;
                    }
  
                //Tjekker z-koordinatet
                }else if (XYZ === 2){
                    if(kPlaceringer[centralpunkt][XYZ] >= 0.50 && kPlaceringer[centralpunkt][XYZ] <= 0.89){
                        z++;
                    }
                }
                //Hvis har fundet 2 eller flere koordinater der passer
                if((x + y + z) === 3){
  
                    //forløkken koerer saa laenge der er daatapunkter
                    for(let tilknyttetCentralpunkt = 0; tilknyttetCentralpunkt < data.length; tilknyttetCentralpunkt++){
  
                        //Tjekker om opgaven er associeret med centralunktet
                        if(mindsteAfstand[tilknyttetCentralpunkt] === centralpunkt){
  
                            //Skubber svarhedsgraden op, hvis ovenstaaende passer 
                            samlingSvaerhedsGrader[tilknyttetCentralpunkt] = svaerhedsgrad;
  
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
            for(let tilknyttetCentralpunkt = 0; tilknyttetCentralpunkt < data.length; tilknyttetCentralpunkt++){
  
                //Tjekker om opgaven er associeret med centralunktet
                if(mindsteAfstand[tilknyttetCentralpunkt] === centralpunkt){
  
                    //Skubber svarhedsgraden op, hvis ovenstaaende passer 
                    samlingSvaerhedsGrader[tilknyttetCentralpunkt] = svaerhedsgrad;
  
                    //taeller taelles op, saa der ikke bliver tjekket for flere svaerhedsgrader
                    taeller++;
                }
            }
        }
    } 
   
    return samlingSvaerhedsGrader;
  }
  module.exports = router;