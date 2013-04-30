var express = require('express');
var app     = express();
var rc      = require('../lib/express-remote_control');

app.listen(3000);

// Configure remote control by giving an end-point
// for the api. This is the only uri to enter.
rc.config({
  root: '/api'
});

// Remote Control gives you two tools to define your API.
// Links - They take a 'rel' parameter and a callback.
rc.link('foo', function(req, res) {
  console.log("hey, I'm a link");
});

rc.link('bar', function(req, res) {
  console.log("hey, I'm another link");
});

// Forms - They take a 'rel' parameter, a formData object, and a callback
// Creating a form automatically creates a link (GET) that returns the data
// required to process the form.
rc.form('formidable', {
  // This will determine the HTTP method to use
  action: 'POST',
  // This will be provided to the client, so they can
  // programatically fill up the form.
  data: [{
    name: 'filter',
    value: ''
  }]
}, function(req, res) {
  console.log("Hey, I'm a form.");
  console.log(req.body.filter);
});

rc(app);
