const express = require('express');
const app = express();

app.use('/css',express.static(__dirname +'/css'));

// Adds index.html as a frontpage, when opening server
app.get('/',(req, res) =>{
    res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => {
    console.log('Server is up and running at port 3000');
});

