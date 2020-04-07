const connection = require('../app').connection;



var mockDbObject = {
    test: 'Value of test',
    hej: 'Hej med dig',
    ServicesErNice: 'Mega fedt!'
};

var opgaver = {
    1: {Opgave: ' Udregn følgende: \n 2 + 2 = '},
    2: {Opgave: ' Udregn følgende: \n 5 + 3 = '}
  
};


module.exports = {
    database: mockDbObject,
    opgavedb: opgaver
}
