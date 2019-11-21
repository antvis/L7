/* global console */
var test = require('tape');
var HTML = require('../index');


test('parse', function (t) {
    var html = '<div class="oh"><p></p></div>';
    var parsed = HTML.parse(html);
    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div',
        attrs: {
            class: 'oh'
        },
        voidElement: false,
        children: [
            {
                type: 'tag',
                name: 'p',
                attrs: {},
                children: [],
                voidElement: false
            }
        ]
    }]);
    t.equal(html, HTML.stringify(parsed));

    html = '<div class="oh"><p>hi</p></div>';
    parsed = HTML.parse(html);

    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div',
        attrs: {
            class: 'oh'
        },
        voidElement: false,
        children: [
            {
                type: 'tag',
                name: 'p',
                attrs: {},
                voidElement: false,
                children: [
                    {
                        type: 'text',
                        content: 'hi'
                    }
                ]
            }
        ]
    }]);
    t.equal(html, HTML.stringify(parsed));

    html = '<div>oh <strong>hello</strong> there! How are <span>you</span>?</div>';
    parsed = HTML.parse(html);

    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div',
        attrs: {},
        voidElement: false,
        children: [
            {
                type: 'text',
                content: 'oh '
            },
            {
                type: 'tag',
                name: 'strong',
                attrs: {},
                voidElement: false,
                children: [
                    {
                        type: 'text',
                        content: 'hello'
                    }
                ]
            },
            {
                type: 'text',
                content: ' there! How are '
            },
            {
                type: 'tag',
                name: 'span',
                attrs: {},
                voidElement: false,
                children: [
                    {
                        type: 'text',
                        content: 'you'
                    }
                ]
            },
            {
                type: 'text',
                content: '?'
            }
        ]
    }]);
    t.equal(html, HTML.stringify(parsed));

    html = '<div class="handles multiple classes" and="attributes"></div>';
    parsed = HTML.parse(html);

    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div',
        attrs: {
            class: 'handles multiple classes',
            and: 'attributes'
        },
        voidElement: false,
        children: []
    }]);
    t.equal(html, HTML.stringify(parsed));

    html = '<div class=\'handles\' other=47 and="attributes"></div>';
    parsed = HTML.parse(html);

    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div',
        attrs: {
            class: 'handles',
            other: '47',
            and: 'attributes'
        },
        voidElement: false,
        children: []
    }]);
    t.equal(HTML.stringify(parsed), '<div class="handles" other="47" and="attributes"></div>');

    html = '<div-custom class="oh"><my-component some="thing"><p>should be ignored</p></my-component></div-custom>';
    parsed = HTML.parse(html, {
        components: {
            'my-component': 'something'
        }
    });

    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div-custom',
        attrs: {
            class: 'oh'
        },
        voidElement: false,
        children: [
            {
                type: 'component',
                name: 'my-component',
                attrs: {
                    some: 'thing'
                },
                voidElement: false,
                children: []
            }
        ]
    }], 'should not include children of registered components in AST');

    html = '<div><my-component thing="one">ok</my-component><my-component thing="two">ok</my-component></div>';
    parsed = HTML.parse(html, {
        components: {
            'my-component': 'something'
        }
    });

    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div',
        attrs: {},
        voidElement: false,
        children: [
            {
                type: 'component',
                name: 'my-component',
                attrs: {
                    thing: 'one'
                },
                voidElement: false,
                children: []
            },
            {
                type: 'component',
                name: 'my-component',
                attrs: {
                    thing: 'two'
                },
                voidElement: false,
                children: []
            }
        ]
    }]);

    html = '<div><img></div>';
    parsed = HTML.parse(html);

    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div',
        attrs: {},
        voidElement: false,
        children: [
            {
                type: 'tag',
                name: 'img',
                attrs: {},
                voidElement: true,
                children: []
            }
        ]
    }], 'should handle unclosed void elements');
    t.equal(HTML.stringify(parsed), '<div><img/></div>');

    html = '<div></div><img>';
    parsed = HTML.parse(html);

    t.deepEqual(parsed, [
        {
            type: 'tag',
            name: 'div',
            attrs: {},
            voidElement: false,
            children: []
        },
        {
            type: 'tag',
            name: 'img',
            attrs: {},
            voidElement: true,
            children: []
        }
    ], 'should handle multiple root nodes');
    t.equal(HTML.stringify(parsed), '<div></div><img/>');

    html = '<div><void-web-component/></div>';
    parsed = HTML.parse(html);
    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div',
        attrs: {},
        voidElement: false,
        children: [
            {
                type: 'tag',
                name: 'void-web-component',
                attrs: {},
                voidElement: true,
                children: []
            }
        ]
    }], 'should handle custom void tags if self-closing');

    html = '<div><void-registered-component/></div>';
    parsed = HTML.parse(html, {components: {'void-registered-component': true}});
    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div',
        attrs: {},
        voidElement: false,
        children: [
            {
                type: 'component',
                name: 'void-registered-component',
                attrs: {},
                voidElement: true,
                children: []
            }
        ]
    }], 'should handle registered void tags if self-closing');


    html = '<div> 9 <input type="text"/> 10 </div>';
    parsed = HTML.parse(html);
    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div',
        attrs: {},
        voidElement: false,
        children: [
            { type: 'text', content: ' 9 ' },
            {
                type: 'tag',
                name: 'input',
                attrs: {
                    type: 'text'
                },
                children: [],
                voidElement: true,
            },
            { type: 'text', content: ' 10 ' },
        ]
    }], 'should not give voidElements children');

    html = '<div></div>\n';
    parsed = HTML.parse(html);
    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div',
        attrs: {},
        voidElement: false,
        children: []
    }], 'should not explode on trailing whitespace');

    html = '<div>Hi</div> There ';
    parsed = HTML.parse(html);
    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div',
        attrs: {},
        voidElement: false,
        children: [
            { type: 'text', content: 'Hi' }
        ]
    },{
        type: 'text', content: ' There '
    }], 'should handle trailing text nodes at the top-level');

    html = '<div>Hi</div> There <span>something</span> <a></a>else ';
    parsed = HTML.parse(html);
    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div',
        attrs: {},
        voidElement: false,
        children: [
            { type: 'text', content: 'Hi' }
        ]
    },{
        type: 'text', content: ' There '
    },{
        type: 'tag',
        name: 'span',
        attrs: {},
        voidElement: false,
        children: [
            { type: 'text', content: 'something' }
        ]
    },{
        type: 'text',
        content: ' '
    },
    {
        type: 'tag',
        name: 'a',
        attrs: {},
        voidElement: false,
        children: []
    },{
        type: 'text', content: 'else '
    }], 'should handle text nodes in the middle of tags at the top-level');

    html = '\n<div>  <span>Hi!</span> </div>\n';
    parsed = HTML.parse(html);
    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div',
        attrs: {},
        voidElement: false,
        children: [
            { type: 'text', content: ' '},
            {
                type: 'tag',
                name: 'span',
                attrs: {},
                voidElement: false,
                children: [
                    { type: 'text', content: 'Hi!' }
                ]
            },
            { type: 'text', content: ' '}
        ]
    }], 'should trim whitespace from the beginning and end of the parsed nodes');

    html = '<div>Hi</div>\n\n <span>There</span> \t <div>\n\t</div>';
    parsed = HTML.parse(html);
    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div',
        attrs: {},
        voidElement: false,
        children: [
            { type: 'text', content: 'Hi' }
        ]
    },{
        type: 'text',
        content: ' '
    },
    {
        type: 'tag',
        name: 'span',
        attrs: {},
        voidElement: false,
        children: [
            { type: 'text', content: 'There' }
        ]
    },{
        type: 'text',
        content: ' '
    },{
        type: 'tag',
        name: 'div',
        attrs: {},
        voidElement: false,
        children: [
            { type: 'text', content: ' ' }
        ]
    }], 'should collapse whitespace');
    // See https://www.w3.org/TR/html4/struct/text.html#h-9.1

    html = '<div>Hi</div>\n\n <span>There</span> \t <iframe>\n\t</iframe>';
    parsed = HTML.parse(html, { ignoreWhitespace: true });
    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div',
        attrs: {},
        voidElement: false,
        children: [
            { type: 'text', content: 'Hi' }
        ]
    },{
        type: 'tag',
        name: 'span',
        attrs: {},
        voidElement: false,
        children: [
            { type: 'text', content: 'There' }
        ]
    },{
        type: 'tag',
        name: 'iframe',
        attrs: {},
        voidElement: false,
        children: []
    }], 'should remove text nodes that are nothing but whitespace if the ignoreWhitespace option is passed');

    html = '<!--\n\t<style type="text/css">\n\t\t.header {\n\t\t\tfont-size: 14px;\n\t\t}\n\t</style>\n\n-->\n<div>Hi</div>';
    parsed = HTML.parse(html);
    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div',
        attrs: {},
        voidElement: false,
        children: [
            { type: 'text', content: 'Hi'}
        ]
    }], 'should ignore HTML comments');

    html = '<div>Hi <!-- I\'m a nested comment! with a <span></span> -->there<strong>!</strong></div><span><!--test--></span>';
    parsed = HTML.parse(html);
    t.deepEqual(parsed, [{
        type: 'tag',
        name: 'div',
        attrs: {},
        voidElement: false,
        children: [
            { type: 'text', content: 'Hi '},
            { type: 'text', content: 'there'},
            {
                type: 'tag',
                name: 'strong',
                attrs: {},
                voidElement: false,
                children: [{ type: 'text', content: '!'}]
            }
        ]
    },{
        type: 'tag',
        name: 'span',
        attrs: {},
        voidElement: false,
        children: []
    }], 'should ignore nested HTML comments');

    html = 'Hello, world!';
    parsed = HTML.parse(html);
    t.deepEqual(parsed, [{
        type: 'text',
        content: 'Hello, world!'
    }], 'should handle just text');
    t.end();
});

test('simple speed sanity check', function (t) {
    var i = 100000;
    var groupSize = 1000;
    var waitLoopSize = 10000000;
    var groups = i / groupSize;
    var html = '<html><head><title>Some page</title></head><body class="hey there"><img src="someURL"><h3>Hey, we need content</h3><br></body></html>';

    var parse = HTML.parse;
    var times = [];
    var count;
    var waitCount;
    var total = 0;
    var start, stepAverage;

    console.log('running ' + i + ' iterations...');

    while(i--) {
        count = groupSize;
        // grab groups
        if (i % count === 0) {
            start = Date.now();
            while(count--) {
                parse(html);
            }
            var diff = Date.now() - start;
            stepAverage = diff/groupSize;
            console.log('group '  + (groups - (i / groupSize)) + ': ' + stepAverage);
            times.push(stepAverage);
            total += stepAverage;
            waitCount = waitLoopSize;
            // forcing a bit of a pause between tests
            while(waitCount--) {}
        }

    }

    // trim off first
    // it's always a slower outlier
    // with higher variability that
    // makes it harder to find differences
    times.shift();

    var max = Math.max.apply(null, times);
    var min = Math.min.apply(null, times);
    var average = total / times.length;

    console.log('max', max);
    console.log('min', min);
    console.log('avg', average);

    t.end();
});
