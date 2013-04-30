var express = require('express');
var app     = express();
var rc      = require('../lib/express-remote_control');

app.listen(3000);

rc.config({
  root: '/api'
});

rc.link('foo', function(req, res) {
  console.log("hey");
});

rc.link('bar', function(req, res) {
  console.log("hey");
});

rc(app);
