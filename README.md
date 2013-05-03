# express-remote_control

[![Build Status](https://travis-ci.org/mikaa123/express-remote_control.png?branch=master)](https://travis-ci.org/mikaa123/express-remote_control) [![Coverage Status](https://coveralls.io/repos/mikaa123/express-remote_control/badge.png?branch=master)](https://coveralls.io/r/mikaa123/express-remote_control)

express-remote_control is a minimalistic library to create hypermedia-inspired rest APIs for express applications.

## Installation

Add this line to your package.json, under "dependencies":

    "express-remote_control": "0.1.1"

Then run:

    $ npm install

Or you can install it yourself as:

    $ npm install express-remote_control

## How it works

express-remote_control allows you to define *processes*. They can be either _links_ or _forms_ which will determinate how the client access them. The _resources_ returned by these processes is left to the user.

express-remote_control takes all the defined processes and set them as *links* on the api's entry point. The entry point's media type is based on json. It defines links like that:

```javascript
{
  "links":[
    {"rel":"foo","href":"/foo"},
    {"rel":"bar","href":"/bar"},
    {"rel":"formidable-form","href":"/formidable-form"}
  ]
}
```

Forms are described as follow:

```javascript
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
```

## Usage

Create an express application, such as:

```javascript
var express = require('express');
var app = express();
```

`require` express-remote_control

```javascript
var rc = require('express-remote_control');
```

Configure it by providing the root uri fragment for your api:

```javascript
rc.config({
  root: '/api'
});
```

Now you can add links:

```javascript
rc.link({
  rel: 'consult-articles',
  desc: 'Retrieves all the articles',
}, function(req, res) {
  res.send(JSON.stringify(articles));
});
```

The callback above will be executed upon a GET request on /api/consult-articles.

You can also define forms using the #form method:

```javascript
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
```

Creating a form using the #form method creates a link on API with a rel being 'form-rel-form', i.e. create-article-form in this case.

Finally, to create the routes, pass the express app to the constructor function:

```javascript
rc(app);
```

And now

    curl localhost:3000/api
    {
      "links":[
        {"rel":"consult-articles","href":"/consult-articles"},
        {"rel":"create-article","href":"/create-article-form"}
      ]
    }

When getting a form, we obtain the http action to use and the data to fill.

    curl http://localhost:3000/api/create-article-form
    { 
      forms: [{
        action: "POST",
        data: [{
          name: "author",
          value: ""
        }, {
          name: "content",
          value: ""
        }],
        rel: "create-article",
        href: "/create-article"
      }]
    }

## Todo

* Use HAL format to represent links
* Create a route at `doc_root` that presents the documentation of the API as HTML

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

