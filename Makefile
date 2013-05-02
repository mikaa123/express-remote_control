REPORTER = spec
test:
	./node_modules/.bin/mocha test/test.js --reporter $(REPORTER)

lib-cov:
	jscoverage lib lib-cov

test-cov: lib-cov
	@RC_COV=1 $(MAKE) test REPORTER=mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js
	rm -rf lib-cov

.PHONY: test
