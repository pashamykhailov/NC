const express = require('express');
const port = process.env.PORT || 3000;
const path = require('path');
const {
  getRequestInsta,
  loadMore,
  defaultPromiseThen,
  getProfileVideo
} = require('./js/services/request');

let app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/html/index.html'));
});

app.get('/get-data', (req, res) => {
  getRequestInsta(req.query.query)
    .then(defaultPromiseThen(res).success, defaultPromiseThen(res).err);
});

app.get('/load-more', (req, res) => {
  loadMore(req.query.user_id, req.query.cursor)
    .then(defaultPromiseThen(res).success, defaultPromiseThen(res).err);
});

app.get('/get-profile-video', (req, res) => {
  getProfileVideo(req.query.video_code)
  .then(defaultPromiseThen(res).success, defaultPromiseThen(res.err));
});

app.listen(port, () => {
  console.log('App running successfully on port:', port);
});
// test