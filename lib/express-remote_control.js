"use strict"

var settings      = {};
var links         = [];
var forms         = [];
var topLevelLinks = [];

// Creates an api end-point at `settings.root`.
// Each workflow will be accessible through links at the root level.
var API = module.exports = function(app) {
  if (!app) throw new Error("No app");

  var hrefFor = function(action) {
    return '/' + action;
  };

  var routeFor = function(action) {
    return settings.root + '/' + action;
  };

  var sendMediaType = function(res, obj) {
    res.set('Content-Type', 'application/vnd.explain+json');
    res.send(JSON.stringify(obj));
  };

  forms.forEach(function(f) {
    f.formData.rel = f.rel;
    f.formData.href = hrefFor(f.rel);

    links.push({
      rel: f.rel + '-form',
      cb: function(req, res) {
        sendMediaType(res, { forms: [f.formData] });
      }
    });

    var middlewares = [f.cb];
    app[f.formData.action.toLowerCase()](routeFor(f.rel), middlewares);
  });

  links.forEach(function(l) {
    var middlewares = [l.cb];

    app.get(routeFor(l.rel), middlewares);
    topLevelLinks.push({
        rel: l.rel,
        href: hrefFor(l.rel)
    });
  });

  app.get(settings.root, function(req, res) {
    sendMediaType(res, { links: topLevelLinks });
  });
}

API.config = function(options) {
  if (!options.root) throw new Error("No root");
  settings = options;
};

API.link = function(rel, cb, options) {
  if (arguments.length < 2) throw new Error('arity too small');
  links.push({
    rel: rel,
    cb: cb
  });
};

API.form = function(rel, formData, cb, options) {
  if (arguments.length < 3) throw new Error('arity too small');
  if (!formData.action) throw new Error('formData does not have an action');

  forms.push({
    rel: rel,
    formData: formData,
    cb: cb,
    options: options || {}
  });
};

API.reset = function() {
  settings      = {};
  links         = [];
  forms         = [];
  topLevelLinks = [];
}

