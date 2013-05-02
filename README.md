# Express Remote Control

[![Build Status](https://travis-ci.org/mikaa123/express-remote_control.png?branch=master)](https://travis-ci.org/mikaa123/express-remote_control)

Express Remote Control is a minimalist library to create hypermedia-inspired rest APIs for express applications.

Hypermedia API abstract the notion of URI and define workflows in term of 'rel'.

## Installation

Add this line to your package.json, under "dependencies":

    "express-remote_control": "0.1.0"

Then run:

    $ npm install

Or you can install it yourself as:

    $ npm install express-remote_control

## Example app

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

And now

    curl localhost:3000/api
    {
      "links":[
        {"rel":"foo","href":"/foo"},
        {"rel":"bar","href":"/bar"},
        {"rel":"formidable-form","href":"/formidable-form"}
      ]
    }

When getting a form, we obtain the http action to use and the data to fill.

    curl http://localhost:3000/api/formidable-form
    { 
      forms: [{
        action: "POST",
        data: [{
          name: "filter",
          value: ""
        }],
        rel: "formidable",
        href: "/formidable"
      }]
    }
