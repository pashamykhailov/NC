const express = require('express');
const port = process.env.PORT || 3000;
const path = require('path');

let app = express();

app.use(express.static(__dirname + '/public'));

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname +'/html/index.html'))
});


app.listen(port, () => {
  console.log('App running successfully on port:', port);
});