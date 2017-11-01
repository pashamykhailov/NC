const express = require('express');
const hbs = require('hbs');
const port = process.env.PORT || 3000;

let app = express();

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

// app.use((req, res, next) => {
//   res.render('maintance.hbs', {
//     pageTitle: "Maintance page",
//     currentYear: new Date().getFullYear()
//   });
// });

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: "Home page",
    currentYear: new Date().getFullYear()
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: "About page",
    currentYear: new Date().getFullYear()
  });
});

app.get('/portfolio', (req, res) => {
  res.render('portfolio.hbs', {
    pageTitle: "Portfolio page",
    testPartial: 'Here test partial image',
    currentYear: new Date().getFullYear()
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'You have an error'
  });
});

app.listen(port, () => {
  console.log('App running successfully on port:', port);
});