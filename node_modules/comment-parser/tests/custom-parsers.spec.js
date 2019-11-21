/* eslint no-unused-vars:off */
var expect = require('chai').expect
var parse = require('./parse')

describe('parse() with custom tag parsers', function () {
  function sample () {
    /**
     * @tag {type} name description
     */
    var a
  }

  it('should use `opts.parsers`', function () {
    var parsers = [
      function everything (str) {
        return {
          source: str,
          data: {
            tag: 'tag',
            type: 'type',
            name: 'name',
            optional: false,
            description: 'description'
          }
        }
      }
    ]

    expect(parse(sample, {parsers: parsers})[0])
      .to.eql({
        line: 1,
        description: '',
        source: '@tag {type} name description',
        tags: [{
          tag: 'tag',
          type: 'type',
          name: 'name',
          description: 'description',
          optional: false,
          source: '@tag {type} name description',
          line: 2
        }]
      })
  })

  it('should merge parsers result', function () {
    var parsers = [
      function parser1 (str) {
        return {
          source: '',
          data: {tag: 'tag'}
        }
      },
      function parser2 (str) {
        return {
          source: '',
          data: {type: 'type'}
        }
      },
      function parser3 (str) {
        return {
          source: '',
          data: {
            name: 'name',
            description: 'description'
          }
        }
      }
    ]

    expect(parse(sample, {parsers: parsers})[0])
      .to.eql({
        line: 1,
        description: '',
        source: '@tag {type} name description',
        tags: [{
          tag: 'tag',
          type: 'type',
          name: 'name',
          description: 'description',
          optional: false,
          source: '@tag {type} name description',
          line: 2
        }]
      })
  })

  it('should catch parser exceptions and populate `errors` field', function () {
    var parsers = [
      function parser1 (str) {
        return {
          source: '',
          data: {tag: 'tag'}
        }
      },
      function parser2 (str) {
        throw new Error('error 1')
      },
      function parser3 (str) {
        throw new Error('error 2')
      },
      function parser4 (str) {
        return {
          source: '',
          data: {name: 'name'}
        }
      }
    ]

    expect(parse(sample, {parsers: parsers})[0])
      .to.eql({
        line: 1,
        description: '',
        source: '@tag {type} name description',
        tags: [{
          tag: 'tag',
          type: '',
          name: 'name',
          description: '',
          optional: false,
          source: '@tag {type} name description',
          errors: [
            'parser2: error 1',
            'parser3: error 2'
          ],
          line: 2
        }]
      })
  })
})
