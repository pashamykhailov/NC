const express = require('express');
const port = process.env.PORT || 3000;
const path = require('path');
const request = require('request');
const fs = require('fs');

function download(uri, filename, callback){
request.head(uri, function(err, res){
console.log('content-type:', res.headers['content-type']);
console.log('content-length:', res.headers['content-length']);

request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
});
}

let app = express();

function getRequestInsta(query) {
  return new Promise((resolve, reject) => {
    request({
      url: `http://api.ninja-miners.com/instagram?query=${query}`,
      json: true
    }, (error, response, body) => {
      if (error) {
        reject('error occurs ', error);
      } else if (body.status === 'ZERO_RESULTS') {
        reject('ZERO_RESULTS ');
      } else if (body && body.result) {
        console.log('body ', body);
        resolve(body);
      } else {
        reject(`error ${error}`);
      }
    });
  });
}

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/html/index.html'));
});

app.get('/get-data', (req, res) => {
  getRequestInsta(req.query.query).then((success) => {
    res.send(success);
  }, (error) => {
    res.status(400);
    res.send(error);
  });
});

app.listen(port, () => {
download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
  console.log('done');
  });
  console.log('App running successfully on port:', port);
});