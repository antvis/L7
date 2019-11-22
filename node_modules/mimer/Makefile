SHELL = /bin/sh
NPM   = npm
NODE  = node
MODULE = ./node_modules/.bin/

install:
	$(NPM) install
test: lint build spec
fulltest: clean install test
clean:
	rm -rf node_modules
lint:
	$(MODULE)jshint mimer.js lib/*
build:
	@echo "Creating web file"
	node browser_build.js
	@echo "Creating minified version"
	$(MODULE)uglifyjs --comments '/mimer/' dist/mimer.js -m -o dist/mimer.min.js --source-map dist/mimer.map
spec:
	@echo "Running test suite..."
	$(NODE) test/run.js
	$(NODE) test/server.js browser
	$(NODE) test/server.js amd
.PHONY: test fulltest clean lint build
