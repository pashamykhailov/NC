const express = require('express');
const port = process.env.PORT || 3000;
const path = require('path');
const request = require('request');

let app = express();

function getRequestInsta(query) {
  return new Promise((resolve, reject) => {
    request({
      url: `http://api.ninja-miners.com/instagram?query=${encodeURIComponent(query)}`,
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
    // res.send(error);
    res.send(req);
  });
});

app.listen(port, () => {
  console.log('App running successfully on port:', port);
});