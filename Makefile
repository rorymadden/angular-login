REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER)

test-d:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--debug \
		--reporter $(REPORTER)

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--growl \
		--watch \
		--reporter $(REPORTER)

# test-acceptance:
#    @NODE_ENV=test ./node_modules/.bin/mocha \
#       --bail \
#       test/acceptance/*.js

test-cov: server-cov
	@SERVER_COV=1 $(MAKE) test REPORTER=html-cov > public/coverage.html

app-cov:
	@jscoverage server server-cov

clean:
   rm -f coverage.html
   rm -fr server-cov

.PHONY: test test-w test-d clean

# Best practice testing

# add acceptance tests to test/acceptance
# rename test to test-unit and add test: test-unit test-acceptance

# benchmark:
#    @./support/bench


# .PHONY: test test-unit test-acceptance benchmark clean