var express = require('express');
var router = express.Router();
var environment = require('../enviroment').environment;

var urlencodedParser = bodyParser.urlencoded({ extended: false });

/* GET home page. */
router.get('/:opgavenummer', function(req, res, next) {
  var opgavenummer = req.params.opgavenummer;
  var mysql = require('mysql');

  var con = mysql.createConnection({
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
        res.render('opgaver', {  
            opgavebeskrivelse: result[0].Opgave,
            opgave_ID: result[0].Opgave_ID,
            
            });
      });  

  });


  app.get('/opgaver', function (req, res) {
    res.render('opgaver', { qs: req.query });
});

app.post('/opgaver/sendA', urlencodedParser, function (req, res) {
    console.log(req.body);
    var svar = req.body.svar;
 
    con.connect(function (err) {
        if (err) throw err;
        console.log("connected");

        var sql = `INSERT INTO \`Besvarelser\`(\`Besvarelse_ID\`, \`Tid\`, \`svar\`, \`Elev_ID\`)`; VALUES ([svar],[svar],[svar],[svar]);
        con.query(sql, function (err) {
            if (err) throw err;
            console.log("One record inserted");
        });
    });
    res.render('opgaver', { data: req.body });
});


});

module.exports = router;
