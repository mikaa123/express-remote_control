var assert = require("assert")

describe('rc', function() {
  var rc = require("./../lib/express-remote_control");

  describe('#config', function() {
    it('should be defined', function() {
      assert(rc.config);
    });

    it("throws an error if no 'root' is passed", function() {
      assert.throws(function() {
        rc.config({});
      }, /No root/);
    });

    it("shouldn't throw an error when 'root' is passed", function() {
      assert.doesNotThrow(function() {
        rc.config({
          root: '/api'
        });
      }, /No root/);
    });
  });

  describe('#link', function() {
    it('should be defined', function() {
      assert(rc.link);
    });

    it("should throw an error if arity is < 2", function() {
      assert.throws(function() {
        rc.link();
      }, /arity too small/);

      assert.doesNotThrow(function() {
        rc.link('links-are-cool', function() {});
      }, /arity too small/);
    })
  });

  describe('#form', function() {
    it('should be defined', function() {
      assert(rc.form);
    });

    it("should throw an error if arity is < 3", function() {
      assert.throws(function() {
        rc.form();
      }, /arity too small/);

      assert.doesNotThrow(function() {
        rc.form('links-are-cool', {
          action: 'GET'
        }, function() {});
      }, /arity too small/);
    });

    describe('formData', function() {
      it("should have at least an 'action' option", function() {
        assert.throws(function() {
          rc.form('formdata-test', {}, function() {});
        }, /formData does not have an action/);
      });
    });
  });

  describe('rc()', function() {
    var express;
    var app;

    before(function() {
      express = require('express');
      app     = express();
      app.listen(3000);
      rc.reset();
    });

    it("requires an app to be passed as argument", function() {
      assert.throws(function() {
        rc();
      }, /No app/);
    });

    describe("when configured with links and forms", function() {
      var links = ['foolink', 'barlink'];
      var forms = [{
        rel: 'fooform',
        formData: {
          action: 'GET'
        }
      }];

      before(function() {
        rc.config({ root: '/api' });
        links.forEach(function(l) { rc.link(l, function() {}); });
        forms.forEach(function(f) { rc.form(f.rel, f.formData, function() {}); });
      });

      it("creates a route at 'config.root' with all the links", function() {
        rc(app);
        var routesGet = app.routes.get.map(function(route) { return route.path });
        links.forEach(function(l) { assert.notEqual(-1, routesGet.indexOf('/api/' + l)); });
      });

      it("creates links to form", function() {
        rc(app);
        var routesGet = app.routes.get.map(function(route) { return route.path });
        forms.forEach(function(f) { 
          assert.notEqual(-1, routesGet.indexOf('/api/' + f.rel + '-form')); 
        });
      });
    });
  });
})
