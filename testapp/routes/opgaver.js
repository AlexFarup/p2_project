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
    multipleStatements: true
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(`SELECT *
    FROM \`Opgaver\` AS opgaver
        INNER JOIN
            \`Besvarelser\` AS besvarelser
            ON opgaver.opg_Bes_ID = besvarelser.Besvarelse_ID   
        WHERE
            opgaver.Opgave_ID = ${opgavenummer}`, function (err, result, fields) {

        if (err) throw err;
        console.log(result[0]);
        res.render('opgaver', {  
            opgavebeskrivelse: result[0].opg_Opgave,
            opgave_ID: result[0].Opgave_ID,
            besvarelse_svar: result[0].Besv_Svar,
          forventet_svar: result[0].opg_Forv_svar
            });
      }); 
  });
});



router.post('/sendA/:opgavenummer', function (req, res) {
  console.log(req.body);
  var svar = req.body.svar;
  var opgavenummer = req.params.opgavenummer;
  var mysql = require('mysql');
 var forventet_svar = req.body.forventet_svar;
  
  var con = mysql.createConnection({
    host: environment.host,
    user: environment.user,
    password: environment.password,
    database: environment.database,
    port: environment.port,
    multipleStatements: true
  });

 
  con.connect(function (err) {
      if (err) throw err;
      console.log("connected");

       if (`${svar}` == forventet_svar) {
        var sql = `UPDATE \`Besvarelser\` SET \`Besv_Score\` = 1, \`Besv_Svar\` = ${svar} WHERE \`Besvarelse_ID\` = ${opgavenummer}`;
      }
      else  {
        var sql = `UPDATE \`Besvarelser\` SET \`Besv_Score\` = 0, \`Besv_Svar\` = ${svar} WHERE \`Besvarelse_ID\` = ${opgavenummer}`;
      } 


      main();

       sql += `; UPDATE \`Opgaver\` SET \`opg_svaerhedsgrad\` = ${samlingSvaerhedsGrader[opgavenummer]} WHERE \`opg_Bes_ID\` = ${opgavenummer}`;


      con.query(sql, function (err) {
        if (err) throw err;
        console.log("hello");
    });  
      
     
  });
  res.redirect(`back`);
});



var data = [
  [100, 50, 15], // opgave 1

  [10, 200, 2], // opgave 2

  [98, 45, 15], // opgave 3

  [93, 48, 14], // opgave 4

  [95, 120, 15], // opgave 5

  [88, 115, 13], // opgave 6

  [35, 420, 6], // opgave 7

  [84, 220, 10], // opgave 8

  [86, 200, 12], // opgave 9

  [35, 420, 6], // opgave 10

  [55, 255, 11], // opgave 11
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


var samlingSvaerhedsGrader = [];



  
  
function main() {

  mindsteAfstand.length = 0;
  samlingSvaerhedsGrader.length = 0;
  kPlaceringer.length = 0;

  dataExtremer = skafDataExtremer();
  dataRaekkevidde = skafDataRaekkevidde(dataExtremer);
  kPlaceringer = initialiseringK();

  
    
    koer();
    svaerhedsGrad();
    
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
    for (let kKoordinater = 0; kKoordinater < kPlaceringer.length; kKoordinater++) {
      
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
    mindsteAfstand[dataPunkt] = afstande.indexOf(Math.min.apply(null, afstande));
      
    
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
    //Lægger XYZ værdien fra datapunktet (point[dimension]) over i summer som i første iteration er 0
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


function svaerhedsGrad() {

  var x = 0;
  var y = 0;
  var z = 0;

for(let cluster = 0; cluster < kPlaceringer.length; cluster++)

  for(var opgaven = 0; opgaven < data.length; opgaven++) {
    var count = 0;

    // Første cluster --------------
    if(mindsteAfstand[opgaven] === cluster) {

      // Sværhedsgrad 1
      if(count === 0) {
        for(var XYZ = 0; XYZ < 3; XYZ++) {
          if(XYZ === 0) {
            if(data[opgaven][XYZ]/100 >= 0.8) {
              x++;
            } 
          } 

          else if(XYZ === 1) {
            if(data[opgaven][XYZ]/100 < 3) {
              y++;
            } 
          }
          
          else if(XYZ === 2) {
            if(data[opgaven][XYZ]/100 >= 0.12) {
              z++;
            }
            if(x + y + z >= 2){
              samlingSvaerhedsGrader.push(1);
              count++;
              x = 0, y = 0, z = 0;
            }
          } 
        }
      }  

      //Sværhedsgrad 2
      if(count === 0) {
        for(var XYZ = 0; XYZ < 3; XYZ++) {
          if(XYZ === 0) {
            if(data[opgaven][XYZ]/100 >= 0.4 && data[opgaven][XYZ]/100 <= 0.8) {
              x++;
            } 
          } 

          else if(XYZ === 1) {
            if(data[opgaven][XYZ]/100 >= 3 && data[opgaven][XYZ]/100 < 4.2) {
              y++;
            } 
          }
          
          else if(XYZ === 2) {
            if(data[opgaven][XYZ]/100 >= 0.7 && data[opgaven][XYZ]/100 <= 0.12) {
              z++;
            } 
            if(x + y + z >= 2){
              samlingSvaerhedsGrader.push(2);
              count++;
              x = 0, y = 0, z = 0;
            }
          } 
        }
      }
      
      // Sværhedsgrad 3
      if(count === 0) {
        for(var XYZ = 0; XYZ < 3; XYZ++) {
          if(XYZ === 0) {
            if(data[opgaven][XYZ]/100 <= 0.4) {
              x++;
            } 
          } 

          else if(XYZ === 1) {
            if(data[opgaven][XYZ]/100 > 4.2) {
              y++;
            } 
          }
          
          else if(XYZ === 2) {
            if(data[opgaven][XYZ]/100 < 0.12) {
              z++;
            } 
            if(x + y + z >= 2){
              samlingSvaerhedsGrader.push(3);
              count++;
              x = 0, y = 0, z = 0;
            }
          } 
        }
      }
    }    
   

  }
}





module.exports = router;
