/* eslint no-unused-vars:off */

var expect = require('chai').expect
var parse = require('./parse')

describe('Comment string parsing', function () {
  it('should parse doc block with description', function () {
    expect(parse(function () {
      /**
       * Description
       */
    })[0])
      .to.eql({
        description: 'Description',
        source: 'Description',
        line: 1,
        tags: []
      })
  })

  it('should parse doc block with no mid stars', function () {
    expect(parse(function () {
      /**
         Description
       */
    })[0])
      .to.eql({
        description: 'Description',
        source: 'Description',
        line: 1,
        tags: []
      })
  })

  it('should skip surrounding empty lines while preserving line numbers', function () {
    expect(parse(function () {
      /**
       *
       *
       * Description first line
       *
       * Description second line
       *
       */
      var a
    })[0])
      .eql({
        description: 'Description first line\n\nDescription second line',
        source: 'Description first line\n\nDescription second line',
        line: 1,
        tags: []
      })
  })

  it('should accept a description on the first line', function () {
    expect(parse(function () {
      /** Description first line
       *
       * Description second line
       */
      var a
    })[0])
      .eql({
        description: 'Description first line\n\nDescription second line',
        source: 'Description first line\n\nDescription second line',
        line: 1,
        tags: []
      })
  })

  it('should parse not starred middle lines with `opts.trim = true`', function () {
    expect(parse(function () {
      /**
         Description text
         @tag tagname Tag description
      */
    }, {
      trim: true
    })[0])
      .eql({
        description: 'Description text',
        source: 'Description text\n@tag tagname Tag description',
        line: 1,
        tags: [{
          tag: 'tag',
          name: 'tagname',
          optional: false,
          description: 'Tag description',
          type: '',
          line: 3,
          source: '@tag tagname Tag description'
        }]
      })
  })

  it('should parse not starred middle lines with `opts.trim = false`', function () {
    expect(parse(function () {
      /**
         Description text
         @tag tagname Tag description
      */
    }, {
      trim: false
    })[0])
      .eql({
        description: '\nDescription text',
        source: '\nDescription text\n@tag tagname Tag description\n',
        line: 1,
        tags: [{
          tag: 'tag',
          name: 'tagname',
          optional: false,
          description: 'Tag description\n',
          type: '',
          line: 3,
          source: '@tag tagname Tag description\n'
        }]
      })
  })

  it('should accept comment close on a non-empty', function () {
    expect(parse(function () {
      /**
       * Description first line
       *
       * Description second line */
      var a
    })[0])
      .eql({
        description: 'Description first line\n\nDescription second line',
        source: 'Description first line\n\nDescription second line',
        line: 1,
        tags: []
      })
  })

  it('should skip empty blocks', function () {
    expect(parse(function () {
      /**
       *
       */
      var a
    }).length)
      .to.eq(0)
  })

  it('should parse multiple doc blocks', function () {
    var p = parse(function () {
      /**
       * Description first line
       */
      var a

      /**
       * Description second line
       */
      var b
    })

    expect(p.length)
      .to.eq(2)

    expect(p[0])
      .to.eql({
        description: 'Description first line',
        source: 'Description first line',
        line: 1,
        tags: []
      })

    expect(p[1])
      .to.eql({
        description: 'Description second line',
        source: 'Description second line',
        line: 6,
        tags: []
      })
  })

  it('should parse one line block', function () {
    expect(parse(function () {
      /** Description */
      var a
    })[0])
      .to.eql({
        description: 'Description',
        source: 'Description',
        line: 1,
        tags: []
      })
  })

  it('should skip `/* */` comments', function () {
    expect(parse(function () {
      /*
       *
       */
      var a
    }).length)
      .to.eq(0)
  })

  it('should skip `/*** */` comments', function () {
    expect(parse(function () {
      /***
       *
       */
      var a
    }).length)
      .to.eq(0)
  })

  it('should preserve empty lines and indentation with `opts.trim = false`', function () {
    expect(parse(function () {
      /**
       *
       *
       *   Description first line
       *     second line
       *
       *       third line
       */
      var a
    }, {
      trim: false
    })[0])
      .eql({
        description: '\n\n\n  Description first line\n    second line\n\n      third line\n',
        source: '\n\n\n  Description first line\n    second line\n\n      third line\n',
        line: 1,
        tags: []
      })
  })

  it('should parse one line block with tag', function () {
    expect(parse(function () {
      /** @tag */
      var a
    })[0])
      .to.eql({
        description: '',
        line: 1,
        source: '@tag',
        tags: [{
          tag: 'tag',
          type: '',
          name: '',
          description: '',
          line: 1,
          optional: false,
          source: '@tag'
        }]
      })
  })

  it('should parse `@tag`', function () {
    expect(parse(function () {
      /**
       *
       * @my-tag
       */
      var a
    })[0])
      .to.eql({
        line: 1,
        source: '@my-tag',
        description: '',
        tags: [{
          line: 3,
          tag: 'my-tag',
          source: '@my-tag',
          type: '',
          name: '',
          optional: false,
          description: ''
        }]
      })
  })

  it('should parse `@tag {my.type}`', function () {
    expect(parse(function () {
      /**
       * @my-tag {my.type}
       */
      var a
    })[0])
      .to.eql({
        line: 1,
        source: '@my-tag {my.type}',
        description: '',
        tags: [{
          line: 2,
          tag: 'my-tag',
          type: 'my.type',
          name: '',
          source: '@my-tag {my.type}',
          optional: false,
          description: ''
        }]
      })
  })

  it('should parse tag with name only `@tag name`', function () {
    expect(parse(function () {
      /**
       * @my-tag name
       */
    })[0])
      .to.eql({
        line: 1,
        description: '',
        source: '@my-tag name',
        tags: [{
          line: 2,
          tag: 'my-tag',
          type: '',
          name: 'name',
          source: '@my-tag name',
          optional: false,
          description: ''
        }]
      })
  })

  it('should parse tag with type and name `@tag {my.type} name`', function () {
    expect(parse(function () {
      /**
       * @my-tag {my.type} name
       */
    })[0])
      .to.eql({
        line: 1,
        source: '@my-tag {my.type} name',
        description: '',
        tags: [{
          tag: 'my-tag',
          line: 2,
          type: 'my.type',
          name: 'name',
          source: '@my-tag {my.type} name',
          description: '',
          optional: false
        }]
      })
  })

  it('should parse tag with type, name and description `@tag {my.type} name description`', function () {
    expect(parse(function () {
      /**
       * @my-tag {my.type} name description
       */
    })[0])
      .to.eql({
        line: 1,
        source: '@my-tag {my.type} name description',
        description: '',
        tags: [{
          tag: 'my-tag',
          line: 2,
          type: 'my.type',
          name: 'name',
          source: '@my-tag {my.type} name description',
          description: 'description',
          optional: false
        }]
      })
  })

  /* eslint-disable no-tabs */
  it('should parse tag with type, name and description `@tag {my.type} name description separated by tab`', function () {
    expect(parse(function () {
      /**
       * @my-tag	{my.type}	name	description
       */
    })[0])
      .to.eql({
        line: 1,
        source: '@my-tag\t{my.type}\tname\tdescription',
        description: '',
        tags: [{
          tag: 'my-tag',
          line: 2,
          type: 'my.type',
          name: 'name',
          source: '@my-tag\t{my.type}\tname\tdescription',
          description: 'description',
          optional: false
        }]
      })
  })
  /* eslint-enable no-tabs */

  it('should parse tag with multiline description', function () {
    expect(parse(function () {
      /**
       * @my-tag {my.type} name description line 1
       * description line 2
       * description line 3
       */
    })[0])
      .to.eql({
        line: 1,
        source: '@my-tag {my.type} name description line 1\ndescription line 2\ndescription line 3',
        description: '',
        tags: [{
          tag: 'my-tag',
          line: 2,
          type: 'my.type',
          name: 'name',
          source: '@my-tag {my.type} name description line 1\ndescription line 2\ndescription line 3',
          description: 'description line 1\ndescription line 2\ndescription line 3',
          optional: false
        }]
      })
  })

  it('should parse tag with type and optional name `@tag {my.type} [name]`', function () {
    expect(parse(function () {
      /**
       * @my-tag {my.type} [name]
       */
    })[0])
      .to.eql({
        line: 1,
        description: '',
        source: '@my-tag {my.type} [name]',
        tags: [{
          tag: 'my-tag',
          line: 2,
          type: 'my.type',
          name: 'name',
          description: '',
          source: '@my-tag {my.type} [name]',
          optional: true
        }]
      })
  })

  it('should parse tag with type and optional name with default value `@tag {my.type} [name=value]`', function () {
    expect(parse(function () {
      /**
       * @my-tag {my.type} [name=value]
       */
    })[0])
      .to.eql({
        line: 1,
        description: '',
        source: '@my-tag {my.type} [name=value]',
        tags: [{
          tag: 'my-tag',
          line: 2,
          type: 'my.type',
          name: 'name',
          default: 'value',
          source: '@my-tag {my.type} [name=value]',
          description: '',
          optional: true
        }]
      })
  })

  it('should tolerate loose tag names', function () {
    expect(parse(function () {
      /**
         Description text
         @.tag0 tagname Tag 0 description
         @-tag1 tagname Tag 1 description
         @+tag2 tagname Tag 2 description
      */
    })[0])
      .eql({
        description: 'Description text',
        source: 'Description text\n@.tag0 tagname Tag 0 description\n@-tag1 tagname Tag 1 description\n@+tag2 tagname Tag 2 description',
        line: 1,
        tags: [{
          tag: '.tag0',
          name: 'tagname',
          optional: false,
          description: 'Tag 0 description',
          type: '',
          line: 3,
          source: '@.tag0 tagname Tag 0 description'
        }, {
          tag: '-tag1',
          name: 'tagname',
          optional: false,
          description: 'Tag 1 description',
          type: '',
          line: 4,
          source: '@-tag1 tagname Tag 1 description'
        }, {
          tag: '+tag2',
          name: 'tagname',
          optional: false,
          description: 'Tag 2 description',
          type: '',
          line: 5,
          source: '@+tag2 tagname Tag 2 description'
        }]
      })
  })

  it('should tolerate default value with whitespces `@tag {my.type} [name=John Doe]`', function () {
    expect(parse(function () {
      /**
       * @my-tag {my.type} [name=John Doe]
       */
    })[0])
      .to.eql({
        line: 1,
        description: '',
        source: '@my-tag {my.type} [name=John Doe]',
        tags: [{
          tag: 'my-tag',
          line: 2,
          type: 'my.type',
          name: 'name',
          description: '',
          source: '@my-tag {my.type} [name=John Doe]',
          optional: true,
          default: 'John Doe'
        }]
      })
  })

  it('should tolerate quoted default value `@tag [name="yay!"]`', function () {
    expect(parse(function () {
      /**
       * @tag {t} [name="yay!"]
       */
    })[0])
      .to.eql({
        line: 1,
        source: '@tag {t} [name="yay!"]',
        description: '',
        tags: [{
          tag: 'tag',
          line: 2,
          type: 't',
          name: 'name',
          source: '@tag {t} [name="yay!"]',
          default: 'yay!',
          optional: true,
          description: ''
        }]
      })
  })

  it('should keep value as is if quotes are mismatched `@tag [name="yay\']`', function () {
    expect(parse(function () {
      /**
       * @tag {t} [name="yay!'] desc
       */
    })[0])
      .to.eql({
        line: 1,
        description: '',
        source: '@tag {t} [name="yay!\'] desc',
        tags: [{
          tag: 'tag',
          line: 2,
          type: 't',
          name: 'name',
          source: '@tag {t} [name="yay!\'] desc',
          default: '"yay!\'',
          optional: true,
          description: 'desc'
        }]
      })
  })

  it('should parse rest names `@tag ...name desc`', function () {
    expect(parse(function () {
      /**
       * @tag {t} ...name desc
       */
    })[0])
      .to.eql({
        line: 1,
        description: '',
        source: '@tag {t} ...name desc',
        tags: [{
          tag: 'tag',
          line: 2,
          type: 't',
          name: '...name',
          optional: false,
          source: '@tag {t} ...name desc',
          description: 'desc'
        }]
      })
  })

  it('should parse optional rest names `@tag [...name] desc`', function () {
    expect(parse(function () {
      /**
       * @tag {t} [...name] desc
       */
    })[0])
      .to.eql({
        line: 1,
        description: '',
        source: '@tag {t} [...name] desc',
        tags: [{
          tag: 'tag',
          line: 2,
          type: 't',
          name: '...name',
          optional: true,
          source: '@tag {t} [...name] desc',
          description: 'desc'
        }]
      })
  })

  it('should parse multiple tags', function () {
    expect(parse(function () {
      /**
       * Description
       * @my-tag1
       * @my-tag2
       */
    })[0])
      .to.eql({
        line: 1,
        description: 'Description',
        source: 'Description\n@my-tag1\n@my-tag2',
        tags: [{
          tag: 'my-tag1',
          line: 3,
          type: '',
          name: '',
          optional: false,
          source: '@my-tag1',
          description: ''
        }, {
          tag: 'my-tag2',
          line: 4,
          type: '',
          name: '',
          optional: false,
          source: '@my-tag2',
          description: ''
        }]
      })
  })

  it('should parse nested tags', function () {
    expect(parse(function () {
      /**
       * Description
       * @my-tag name
       * @my-tag name.sub-name
       * @my-tag name.sub-name.sub-sub-name
       */
    }, { dotted_names: true })[0])
      .to.eql({
        line: 1,
        description: 'Description',
        source: 'Description\n@my-tag name\n@my-tag name.sub-name\n@my-tag name.sub-name.sub-sub-name',
        tags: [{
          tag: 'my-tag',
          line: 3,
          type: '',
          name: 'name',
          source: '@my-tag name',
          optional: false,
          description: '',
          tags: [{
            tag: 'my-tag',
            line: 4,
            type: '',
            name: 'sub-name',
            optional: false,
            source: '@my-tag name.sub-name',
            description: '',
            tags: [{
              tag: 'my-tag',
              line: 5,
              type: '',
              name: 'sub-sub-name',
              optional: false,
              source: '@my-tag name.sub-name.sub-sub-name',
              description: ''
            }]
          }]
        }]
      })
  })

  it('should parse complex types `@tag {{a: type}} name`', function () {
    expect(parse(function () {
      /**
       * @my-tag {{a: number}} name
       */
    })[0])
      .to.eql({
        line: 1,
        source: '@my-tag {{a: number}} name',
        description: '',
        tags: [{
          tag: 'my-tag',
          line: 2,
          type: '{a: number}',
          name: 'name',
          source: '@my-tag {{a: number}} name',
          optional: false,
          description: ''
        }]
      })
  })

  it('should gracefully fail on syntax errors `@tag {{a: type} name`', function () {
    expect(parse(function () {
      /**
       * @my-tag {{a: number} name
       */
    })[0])
      .to.eql({
        line: 1,
        description: '',
        source: '@my-tag {{a: number} name',
        tags: [{
          tag: 'my-tag',
          line: 2,
          type: '',
          name: '',
          description: '',
          source: '@my-tag {{a: number} name',
          optional: false,
          errors: ['parse_type: Invalid `{type}`, unpaired curlies']
        }]
      })
  })

  it('should parse $ in description`', function () {
    expect(parse(function () {
      /**
       * @my-tag {String} name description with $ char
       */
    })[0])
      .to.eql({
        line: 1,
        source: '@my-tag {String} name description with $ char',
        description: '',
        tags: [{
          tag: 'my-tag',
          line: 2,
          type: 'String',
          name: 'name',
          source: '@my-tag {String} name description with $ char',
          optional: false,
          description: 'description with $ char'
        }]
      })
  })

  it('should parse doc block with bound forced to the left', function () {
    expect(parse(function () {
      /**
   * Description text
   * @tag tagname Tag description
   */
    })[0])
      .to.eql({
        description: 'Description text',
        source: 'Description text\n@tag tagname Tag description',
        line: 1,
        tags: [{
          tag: 'tag',
          name: 'tagname',
          optional: false,
          description: 'Tag description',
          type: '',
          line: 3,
          source: '@tag tagname Tag description'
        }]
      })
  })

  it('should parse doc block with bound forced to the right', function () {
    expect(parse(function () {
      /**
           * Description text
           * @tag tagname Tag description
           */
    })[0])
      .to.eql({
        description: 'Description text',
        source: 'Description text\n@tag tagname Tag description',
        line: 1,
        tags: [{
          tag: 'tag',
          name: 'tagname',
          optional: false,
          description: 'Tag description',
          type: '',
          line: 3,
          source: '@tag tagname Tag description'
        }]
      })
  })

  it('should parse doc block with soft bound', function () {
    expect(parse(function () {
      /**
   Description text
           another line
   @tag tagname Tag description
   */
    })[0])
      .to.eql({
        description: 'Description text\nanother line',
        source: 'Description text\nanother line\n@tag tagname Tag description',
        line: 1,
        tags: [{
          tag: 'tag',
          name: 'tagname',
          optional: false,
          description: 'Tag description',
          type: '',
          line: 4,
          source: '@tag tagname Tag description'
        }]
      })
  })

  it('should parse doc block with soft bound respecting `opts.trim = false`', function () {
    expect(parse(function () {
      /**
   Description text
           another line
   @tag tagname Tag description
   */
    }, {
      trim: false
    })[0])
      .to.eql({
        description: '\nDescription text\n  another line',
        source: '\nDescription text\n  another line\n@tag tagname Tag description\n',
        line: 1,
        tags: [{
          tag: 'tag',
          name: 'tagname',
          optional: false,
          description: 'Tag description\n',
          type: '',
          line: 4,
          source: '@tag tagname Tag description\n'
        }]
      })
  })

  it('should parse multiline without star as same line respecting `opts.join = true`', function () {
    expect(parse(function () {
      /**
       * @tag name
       * description
         same line
       */
    }, {
      join: true
    })[0])
      .to.eql({
        line: 1,
        description: '',
        source: '@tag name\ndescription\nsame line',
        tags: [{
          tag: 'tag',
          line: 2,
          type: '',
          name: 'name',
          description: 'description same line',
          source: '@tag name\ndescription same line',
          optional: false
        }]
      })
  })

  it('should parse multiline without star as same line respecting `opts.join = "\\t"`', function () {
    expect(parse(function () {
      /**
       * @tag name
       * description
         same line
       */
    }, {
      join: '\t'
    })[0])
      .to.eql({
        line: 1,
        description: '',
        source: '@tag name\ndescription\nsame line',
        tags: [{
          tag: 'tag',
          line: 2,
          type: '',
          name: 'name',
          description: 'description\tsame line',
          source: '@tag name\ndescription\tsame line',
          optional: false
        }]
      })
  })

  it('should parse multiline without star as same line with intent respecting `opts.join = 1` and `opts.trim = false`', function () {
    expect(parse(function () {
      /**
       * @tag name
       * description
           intent same line
       */
    }, {
      join: 1,
      trim: false
    })[0])
      .to.eql({
        line: 1,
        description: '',
        source: '\n@tag name\ndescription\n  intent same line\n',
        tags: [{
          tag: 'tag',
          line: 2,
          type: '',
          name: 'name',
          description: 'description  intent same line\n',
          source: '@tag name\ndescription  intent same line\n',
          optional: false
        }]
      })
  })

  it('should parse same line closing section (issue #22)', function () {
    expect(parse(function () {
      /**
       * Start here
       * Here is more stuff */
      var a
    })[0])
      .to.eql({
        description: 'Start here\nHere is more stuff',
        line: 1,
        source: 'Start here\nHere is more stuff',
        tags: []
      })
  })

  it('should tolerate inconsistent formatting (issue #29)', function () {
    expect(parse(function () {
      /**
         * @param {Object} options 配置
         * @return {Any} obj 组件返回的对象
         * @example
         * var widget = XX.showWidget('searchlist', {
         *    onComplete: function() {
         *          todoSomething();
         *     }
         * });
     */
    }, {
      join: 1,
      trim: false
    })[0]).to.eql({
      description: '',
      line: 1,
      source: "\n@param {Object} options 配置\n@return {Any} obj 组件返回的对象\n@example\nvar widget = XX.showWidget('searchlist', {\n   onComplete: function() {\n         todoSomething();\n    }\n});\n",
      tags: [{
        description: '配置',
        line: 2,
        name: 'options',
        optional: false,
        source: '@param {Object} options 配置',
        tag: 'param',
        type: 'Object'
      }, {
        description: '组件返回的对象',
        line: 3,
        name: 'obj',
        optional: false,
        source: '@return {Any} obj 组件返回的对象',
        tag: 'return',
        type: 'Any'
      }, {
        description: "widget = XX.showWidget('searchlist', {\n   onComplete: function() {\n         todoSomething();\n    }\n});\n",
        line: 4,
        name: '\nvar',
        optional: false,
        source: "@example\nvar widget = XX.showWidget('searchlist', {\n   onComplete: function() {\n         todoSomething();\n    }\n});\n",
        tag: 'example',
        type: ''
      }]
    })
  })

  it('should keep optional names spaces (issue #41)`', function () {
    expect(parse(function () {
      /**
       * @section [Brand Colors] Here you can find all the brand colors
       */
    })[0])
      .to.eql({
        line: 1,
        source: '@section [Brand Colors] Here you can find all the brand colors',
        description: '',
        tags: [{
          tag: 'section',
          line: 2,
          type: '',
          name: 'Brand Colors',
          source: '@section [Brand Colors] Here you can find all the brand colors',
          optional: true,
          description: 'Here you can find all the brand colors'
        }]
      })
  })

  it('should keep quotes in description (issue #41)`', function () {
    expect(parse(function () {
      /**
       * @section "Brand Colors" Here you can find all the brand colors
       */
    })[0])
      .to.eql({
        line: 1,
        source: '@section "Brand Colors" Here you can find all the brand colors',
        description: '',
        tags: [{
          tag: 'section',
          line: 2,
          type: '',
          name: 'Brand Colors',
          source: '@section "Brand Colors" Here you can find all the brand colors',
          optional: false,
          description: 'Here you can find all the brand colors'
        }]
      })
  })

  it('should use only quoted name (issue #41)`', function () {
    expect(parse(function () {
      /**
       * @section "Brand Colors" Here you can find "all" the brand colors
       */
    })[0])
      .to.eql({
        line: 1,
        source: '@section "Brand Colors" Here you can find "all" the brand colors',
        description: '',
        tags: [{
          tag: 'section',
          line: 2,
          type: '',
          name: 'Brand Colors',
          source: '@section "Brand Colors" Here you can find "all" the brand colors',
          optional: false,
          description: 'Here you can find "all" the brand colors'
        }]
      })
  })

  it('should ignore inconsitent quoted groups (issue #41)`', function () {
    expect(parse(function () {
      /**
       * @section "Brand Colors Here you can find all the brand colors
       */
    })[0])
      .to.eql({
        line: 1,
        source: '@section "Brand Colors Here you can find all the brand colors',
        description: '',
        tags: [{
          tag: 'section',
          line: 2,
          type: '',
          name: '"Brand',
          source: '@section "Brand Colors Here you can find all the brand colors',
          optional: false,
          description: 'Colors Here you can find all the brand colors'
        }]
      })
  })
})
