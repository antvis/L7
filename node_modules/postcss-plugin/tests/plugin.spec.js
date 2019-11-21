// The structure of this document was shamelessly copied from: https://github.com/SaraVieira/postcss-caralho/blob/master/test/test.js

const postcss = require('postcss');
const expect = require('chai').expect;
// it will automatically look for index.js
const plugin = require('../');

/**
 * Compares postcss input and output css as strings.
 * It also checks if there was any warning generated with the plugin
 *
 * The original code comes from the {@link https://github.com/SaraVieira/postcss-caralho postcss-caralho repository}
 *
 * @author Sara Vieira <hey@iamsaravieira.com>
 * @param  {String}   input  The string to be interpreted as a CSS rule
 * @param  {String}   output The string that is expected to come out after being processed by postcss
 * @param  {Object}   options   An object with additional options to be used when the plugin is called
 * @param  {Function} done   A function that flags the test as being completed successfully. It is usually something from a MochaJS describe function
 */
function testPostCss(input, output, options, done) {
	postcss([plugin(options)])
		.process(input)
		.then(result => {
			expect(result.css).to.eql(output)
			expect(result.warnings()).to.be.empty
			done()
		})
		.catch(error => done(error))
}

describe('postcss-fpf-colors', function() {
	it('should convert benfica to red', done =>
		testPostCss(
			'a{ color:benfica; }',
			'a{ color:#ff0000; }',
			{},
			done
		))

	it('should convert porto to blue and supports spaces', done =>
		testPostCss(
			'td{ border-color: 1px solid porto; }',
			'td{ border-color: 1px solid blue; }',
			{},
			done
		))

    it('should convert sporting to green, and supports ()', done =>
  		testPostCss(
  			'div{ background: linear-gradient(sporting, sporting); }',
  			'div{ background: linear-gradient(green, green); }',
  			{},
  			done
  		))

      it('should NOT convert when it is not the start of the value or has no spaces in-between', done =>
    		testPostCss(
    			'div{ background-image: url("sporting.jpg"); }',
    			'div{ background-image: url("sporting.jpg"); }',
    			{},
    			done
    		))
})
