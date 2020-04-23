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
    multipleStatements: true,

    
  });

  function promise(){
      return new Promise(function(resolve, reject){
        con.connect(function(err) {
            if (err){
                return reject(err);
            }
            console.log("Connected!");
            con.query(`SELECT * 
            FROM \`Opgaver\` AS opgave
                INNER JOIN
                    \`Besvarelser\` AS besvarelse
                    ON opgave.opg_Bes_ID = besvarelse.Besvarelse_ID
                INNER JOIN
                    \`Km_data\` AS km_data
                    ON opgave.opg_Km_ID = km_data.Km_ID 
                WHERE 
                    opgave.Opgave_ID = ${opgavenummer}`, function (err, result, fields) {
                if (err) throw err;
                console.log(result[0]);
                res.render('opgaver1', {  
                    opgavebeskrivelse: result[0].opg_Opgave,
                    opgave_ID: result[0].opg_Opgave_ID,
                    besvar_Tid: result[0].Besv_Tid,
                    besvar_Score: result[0].Besv_Score,
                    besvar_Besvaret: result[0].Besv_Besvaret,
                    
                });
            });  
        });
  
        }

 


  
    )}
  });

  
  
router.post('/sendA/:opgavenummer', function (req, res) {
  console.log(req.body);
  var svar = req.body.svar;
  var opgavenummer = req.params.opgavenummer;
  var mysql = require('mysql');

  
  var con = mysql.createConnection({
    host: environment.host,
    user: environment.user,
    password: environment.password,
    database: environment.database,
    port: environment.port
  });


  con.connect(function (err) {
      if (err) throw err;
      console.log("connected");

      var sql = `INSERT INTO \`Besvarelser\` (\`Besvarelse_ID\`, \`besv_Tid\`, \`besv_svar\`, \`besv_Elev_ID\`) VALUES (${opgavenummer}, '0', ${svar}, '1')`;
      con.query(sql, function (err) {
          if (err) throw err;
          console.log("One record inserted");

      });
  });
  res.redirect(`back`);
});


let elev_ID = [];

for(let elev_id = 0; elev_id < 3; elev_id++){

  for(let opgave_id = 0; opgave_id < 15; opgave_id++){
    elev_ID[opgave_id] = [];

    for (let besvarelse = 0;  besvarelse < 3; besvarelse++){
      elev_ID[opgave_id][besvarelse] = [];
 
    }
  }
  console.log(elev_ID); 
}




let data = [
  [],
];

// let kPlaceringer = let kPlaceringer
// let mindsteAfstand = let mindsteAfstand
// let dataExtremer = let dataExtremer
// let dataRaekkevidde = let dataRaekkevidde

let kPlaceringer = [];
let mindsteAfstand = [];
let dataExtremer;
let dataRaekkevidde;
let rang1;
let rang2;
let rang3;


main();

function main() {
  dataExtremer = skafDataExtremer();
  dataRaekkevidde = skafDataRaekkevidde(dataExtremer);
  kPlaceringer = initialiseringK();

  koer();
}
// Her definerer hvilke datapunkter udgøre vores extremer/grænser

function skafDataExtremer() {
  let extremer = [];

  for (let dataPunkt = 0; dataPunkt < data.length; dataPunkt++) {
    let punkt = data[dataPunkt];

    // I den første if sætning kontrollere vi om extremer arrayet på den i'ete plads er defineret
    // altså om den har nogen værdi. Hvis ikke, så giver vi den en minimums og max grænse
    for (let XYZ = 0; XYZ < punkt.length; XYZ++) {
      if (!extremer[XYZ]) {
        extremer[XYZ] = { min: 1000, max: 0 };
      }

      // Her definerer vi en minimumsgrænse
      if (punkt[XYZ] < extremer[XYZ].min) {
        extremer[XYZ].min = punkt[XYZ];
      }

      // Her definere vi en maksimumsgrænse
      if (punkt[XYZ] > extremer[XYZ].max) {
        extremer[XYZ].max = punkt[XYZ];
      }
    }
  }

  return extremer;
}

// Finder området vi kigger på i henholdsvis X og Y aksen
function skafDataRaekkevidde(extremer) {
  let raekkevidde = [];

  for (let XYZ = 0; XYZ < extremer.length; XYZ++) {
    raekkevidde[XYZ] = extremer[XYZ].max - extremer[XYZ].min;
  }

  return raekkevidde;
}

function initialiseringK(k) {
  // Hvis k ikke har en værdi sættes den til 3,
  // da vi 3 rangeringer vi gerne vil finde
  if (k === undefined) {
    k = 3;
  }

  // Finder et X og Y koordinat til hver k punkt
  while (k > 0) {
    let kPlads = [];

    // .min bruges her da vi gerne vil finde en k placering indenfor vores område
    // defineret i vores forrige funktion.
    // Havde det været max ville k blive placeret uden for vores rækkevidde,
    // da vi skalere med dataR
    for (let XYZ = 0; XYZ < dataExtremer.length; XYZ++) {
      kPlads[XYZ] =
        dataExtremer[XYZ].min + Math.random() * dataRaekkevidde[XYZ];
    }

    kPlaceringer.push(kPlads);

    k--;
  }

  return kPlaceringer;
}

function euclids() {
  // Yderste for-løkke tager et X og Y koordinatet fra et punkt i datasæt
  for (let dataPunkt = 0; dataPunkt < data.length; dataPunkt++) {
    let punkt = data[dataPunkt];
    let afstande = [];

    // Tager et k punkts koordinater og placere i letiabel
    // Dette gøres for at vi næste for-løkke kan finde afstandende mellem
    // alle datapunkterne og de 3 k clusters
    for (
      let kKoordinater = 0;
      kKoordinater < kPlaceringer.length;
      kKoordinater++
    ) {
      let kPlads = kPlaceringer[kKoordinater];
      let sum = 0;

      // Her findes afstanden mellem de førnævnte datapunkter og k clusters
      // Alle datapunkterne sammenlignes med et k cluster af gangen
      // Forskellen summeres op
      for (let XYZ = 0; XYZ < punkt.length; XYZ++) {
        let forskel = punkt[XYZ] - kPlads[XYZ];
        forskel *= forskel;
        sum += forskel;
      }

      // Her fuldføres euclids formlen ved at tage kvadratroden af summen
      afstande[kKoordinater] = Math.sqrt(sum);
    }

    // Finder indexet på den k værdi der har den mindste afstand til punktet
    // og lægger i et array (skal bruges senere)
    mindsteAfstand[dataPunkt] = afstande.indexOf(
      Math.min.apply(null, afstande)
    );
  }
}

function flytKpunkt() {
  //Kalder euclids funktion for at finde mindsteafstanden fra hvert datapunkt til hvert k punkt
  euclids();

  // Vi tager means arrayets længde og laver sums om til et array med samme længde (Means indeholder alle de tilfældige X, Y og Z værdier for centralpunkterne)
  let summer = Array(kPlaceringer.length);
  // Vi tager means arrayets længde og laver sums om til et array med samme længde (Means indeholder alle de tilfældige X, Y og Z værdier for centralpunkterne)
  let counter = Array(kPlaceringer.length);
  let flyttet = false;

  //Vi forbereder summer til at kunne blive til et to-dimensionelt array
  //Det bliver lavet til et array med et array inden i
  for (let kKoordinater = 0; kKoordinater < kPlaceringer.length; kKoordinater++) {
    counter[kKoordinater] = 0;

    // Her laves der plads til et X og et Y koordinat på hvert felt i
    // summer arrayet eksempel summer[[X, Y, Z], [X, Y, Z], [X, Y, Z]]
    summer[kKoordinater] = Array(kPlaceringer[kKoordinater].length);

    // For at sikre at vi ved hvilke værdier der kommer ind i summer arrayet
    // initialiseres alle felterne til 0
    // summer [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    for (let XYZ = 0; XYZ < kPlaceringer[kKoordinater].length; XYZ++) {
      summer[kKoordinater][XYZ] = 0;
    }
  }

  for (let punkt_index = 0; punkt_index < mindsteAfstand.length; punkt_index++) {
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
    //Lægger X værdien fra datapunktet (point[dimension]) over i sums som i første iteration er 0
    for (let XYZ = 0; XYZ < kPlads.length; XYZ++) {
      summer[k_index][XYZ] += punkt[XYZ];
    }
  }

  for (let k_index = 0; k_index < summer.length; k_index++) {
    //Kontrollere at alle k punkter har et datapunkt associeret med det
    if (0 === counter[k_index]) {
      summer[k_index] = kPlaceringer[k_index];

      // Hvis det viser sig at et k punkt ikke har nogle datapunkter findes der en ny tilfældig placering
      for (let XYZ = 0; XYZ < dataExtremer.length; XYZ++) {
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
    for (let XYZ = 0; XYZ < summer[k_index].length; XYZ++) {
      summer[k_index][XYZ] /= counter[k_index];
    }
  }

  // Hvis vores k placering er forskelligt fra vores summer, så betyder det at vores k punkt har flyttet sig
  if (kPlaceringer.toString() !== summer.toString()) {
    flyttet = true;
  } else {
    // Her ved vi at vi har vores grupperingere da k punktet ikke længere flytter sig
    rang1 = kPlaceringer[0];
    rang2 = kPlaceringer[1];
    rang3 = kPlaceringer[2];
  }

  // Hvis k punktet er forskelligt fra vores summer, betyder det at vi ikke er færdige endnu, og vores summer kan derfor blive vores nye k placeringer
  kPlaceringer = summer;

  return flyttet;
}

// Denne funktion sørger for at køre vores k-means algoritme indtil k punkterne ikke længere flytter sig
function koer() {
  let flyttet = flytKpunkt();
  if (flyttet !== false) {
    koer();
  }
}

console.log(rang1, rang2, rang3);

module.exports = router;
