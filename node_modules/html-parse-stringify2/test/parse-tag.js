var test = require('tape');
var parseTag = require('../lib/parse-tag');


test('parseTag', function (t) {
    var tag = '<div class=thing other=stuff something=54 quote="me ">';

    t.deepEqual(parseTag(tag), {
        type: 'tag',
        attrs: {
            class: 'thing',
            other: 'stuff',
            something: '54',
            quote: 'me '
        },
        name: 'div',
        voidElement: false,
        children: []
    });

    tag = '<something-custom class=\'single quoted thing\'>';

    t.deepEqual(parseTag(tag), {
        type: 'tag',
        attrs: {
            class: 'single quoted thing'
        },
        name: 'something-custom',
        voidElement: false,
        children: []
    });

    tag = '</p>';

    t.deepEqual(parseTag(tag), {
        type: 'tag',
        attrs: {},
        name: 'p',
        voidElement: false,
        children: []
    });

    tag = '<img src="something" alt="sweet picture"/>';

    t.deepEqual(parseTag(tag), {
        type: 'tag',
        attrs: {
            src: 'something',
            alt: 'sweet picture'
        },
        name: 'img',
        voidElement: true,
        children: []
    });

    tag = '<div class="button another-button" onclick="do(\'something\');" onhover=\'do("something else")\'>';

    t.deepEqual(parseTag(tag), {
        type: 'tag',
        attrs: {
            class: 'button another-button',
            onclick: 'do(\'something\');',
            onhover: 'do("something else")'
        },
        name: 'div',
        voidElement: false,
        children: []
    });

    tag = '<textarea placeholder=\'Hey Usher, \n\nAre these modals for real?!\' class=\'placeholder-value\'>';

    t.deepEqual(parseTag(tag), {
        type: 'tag',
        attrs: {
            placeholder: 'Hey Usher, \n\nAre these modals for real?!',
            class: 'placeholder-value'
        },
        name: 'textarea',
        voidElement: false,
        children: []
    });

    tag = '<input checked name="sad" type="checkbox">';

    t.deepEqual(parseTag(tag), {
        type: 'tag',
        attrs: {
            type: 'checkbox',
            checked: 'checked',
            name: 'sad'
        },
        name: 'input',
        voidElement: true,
        children: []
    });

    t.end();
});
