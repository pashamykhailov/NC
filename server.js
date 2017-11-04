const express = require('express');
const port = process.env.PORT || 3000;
const path = require('path');
const request = require('request');

let app = express();
function getRequestInsta(url) {
  return new Promise((resolve, reject) => {
    request({
      url: `http://api.ninja-miners.com/instagram?url=${url}`,
      json: true
    }, (error, response, body) => {
      if (error) {
        reject('error occurs ', error);
      } else if (body.status === 'ZERO_RESULTS') {
        reject('ZERO_RESULTS ');
      } else if (body.result.image_url) {
        console.log('body ',body);
        resolve(body);
      } else  {
        reject('please check is your url is correct ', url);
      }
    });
  });
}

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/html/index.html'))
});

app.get('/get-image', (req, res) => {
  console.log('req ', req.query);
  getRequestInsta(req.query.url).then((success) => {
    console.log('result ', success);
    res.send(success);
  }, (error) => {
    res.send(error);
  });
});

app.listen(port, () => {
  console.log('App running successfully on port:', port);
});