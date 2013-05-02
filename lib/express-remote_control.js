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
  settings.doc_root = settings.doc_root || '/doc';
  settings = options;
};

API.link = function(options, cb) {
  if (arguments.length < 2) throw new Error('Options and process callback needed.');
  if (!options.rel || !options.desc) {
    throw new Error('Options needs rel and desc.');
  }
  links.push({
    rel: options.rel,
    desc: options.desc,
    cb: cb
  });
};

API.form = function(options, cb) {
  if (arguments.length < 2) throw new Error('Options and process callback needed.');
  if (!options.rel || !options.desc || !options.formData) {
    throw new Error('Options needs rel, desc and formData.');
  }
  if (!options.formData.action) throw new Error('formData does not have an action.');

  forms.push({
    rel: options.rel,
    desc: options.desc,
    formData: options.formData,
    cb: cb,
  });
};

API.reset = function() {
  settings      = {};
  links         = [];
  forms         = [];
  topLevelLinks = [];
}

