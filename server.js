const express = require('express');
const app = express();


// Adds index.html as a frontpage, when opening server
app.get('/',(req, res) =>{
    res.sendFile(__dirname + '/index.html');
});

app.get('/Opgaver/index.html',(req, res) =>{
    res.sendFile(__dirname + '/Opgaver' + '/index.html');
});

app.listen(3000, () => {
    console.log('Server is up and running at port 3000');
});

