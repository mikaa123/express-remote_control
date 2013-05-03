var libpath = process.env['RC_COV'] ? '../lib-cov' : '../lib';
var assert = require("assert");
var request = require('supertest');

describe('rc', function() {
  var rc = require(libpath + "/express-remote_control");

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

    it("should be passed exactly 2 arguments", function() {
      assert.throws(function() {
        rc.link();
      }, /Options and process callback needed./);

      assert.doesNotThrow(function() {
        rc.link({rel: 'foo', desc: 'bar'}, function() {});
      }, /Options and process callback needed/);
    });

    describe('option', function() {
      it('REQUIRES a rel attribute', function() {
        assert.throws(function() {
          rc.link({desc: 'bar'}, function() {});
        }, /Options needs rel and desc./);
      });

      it('REQUIRES a desc attribute', function() {
        assert.throws(function() {
          rc.link({rel: 'bar'}, function() {});
        }, /Options needs rel and desc./);
      });
    });
  });

  describe('#form', function() {
    it('should be defined', function() {
      assert(rc.form);
    });

    it("should be passed exactly 2 arguments", function() {
      assert.throws(function() {
        rc.form();
      }, /Options and process callback needed./);

      assert.doesNotThrow(function() {
        rc.form({rel: 'foo', desc: 'bar', formData: {action:'GET'}}, function() {});
      }, /Options and process callback needed/);
    });

    describe('option', function() {
      it('REQUIRES a rel attribute', function() {
        assert.throws(function() {
          rc.form({desc: 'bar', formData: {action: 'GET'}}, function() {});
        }, /Options needs rel, desc and formData./);
      });

      it('REQUIRES a desc attribute', function() {
        assert.throws(function() {
          rc.form({rel: 'bar', formData: {action: 'GET'}}, function() {});
        }, /Options needs rel, desc and formData./);
      });

      it('REQUIRES a formData attribute', function() {
        assert.throws(function() {
          rc.form({rel: 'bar', desc: 'foo'}, function() {});
        }, /Options needs rel, desc and formData./);
      });
    });

    describe('formData', function() {
      it("should have at least an 'action' option", function() {
        assert.throws(function() {
          rc.form({rel:'foo', desc:'bar', formData:{}}, function() {});
        }, /formData does not have an action./);

        assert.doesNotThrow(function() {
          rc.form({rel:'foo', desc:'bar', formData:{action:'GET'}}, function() {});
        }, /formData does not have an action./);
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
        links.forEach(function(l) { rc.link({rel:l, desc:'d'}, function() {}); });
        forms.forEach(function(f) { rc.form({
          rel:f.rel, desc:'d', formData:f.formData },
          function() {});
        });
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

      describe("/GET on `root`", function() {
        it("should respond with json", function(done) {
          request(app)
            .get("/api")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
        });
      });
    });
  });
})
