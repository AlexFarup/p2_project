var express = require('express');
var router = express.Router();
var db = require('../services/database').database;

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(db);
  res.render('index', { 
    title: 'En Titel Til Peter', 
    database: db });
});

module.exports = router;
