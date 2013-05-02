var express = require('express');
var app     = express();
var rc      = require('../lib/express-remote_control');

app.listen(3000);

// Configure remote control by giving an end-point
// for the api. This is the only uri to enter.
rc.config({
  root: '/api'
});

rc.link({
  rel: 'consult-articles',
  desc: 'Retrieves all the articles',
}, function(req, res) {
  res.send(JSON.stringify(articles));
});

// Forms
// Creating a form automatically creates a link (GET) that returns the data
// required to process the form.
rc.form({
  rel: 'create-article',
  desc: 'Create an article',
  formData: {
    action: 'POST',
    data: [{
      name: 'author',
      value: ''
    }, {
      name: 'content',
      value: ''
    }]
  }
}, function(req, res) {
  var author = req.body.author,
  content = req.body.content;

  console.log('An article is being written...');
});

rc(app);
