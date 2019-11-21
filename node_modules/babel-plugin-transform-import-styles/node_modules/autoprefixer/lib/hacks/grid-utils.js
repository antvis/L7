'use strict';

var parser = require('postcss-value-parser');

function convert(value) {
    if (value && value.length === 2 && value[0] === 'span' && parseInt(value[1], 10) > 0) {
        return [false, parseInt(value[1], 10)];
    }

    if (value && value.length === 1 && parseInt(value[0], 10) > 0) {
        return [parseInt(value[0], 10), false];
    }

    return [false, false];
}

function translate(values, startIndex, endIndex) {
    var startValue = values[startIndex];
    var endValue = values[endIndex];

    if (!startValue) {
        return [false, false];
    }

    var _convert = convert(startValue),
        start = _convert[0],
        spanStart = _convert[1];

    var _convert2 = convert(endValue),
        end = _convert2[0],
        spanEnd = _convert2[1];

    if (start && !endValue) {
        return [start, false];
    }

    if (spanStart && end) {
        return [end - spanStart, spanStart];
    }

    if (start && spanEnd) {
        return [start, spanEnd];
    }

    if (start && end) {
        return [start, end - start];
    }

    return [false, false];
}

function parse(decl) {
    var node = parser(decl.value);

    var values = [];
    var current = 0;
    values[current] = [];

    for (var _iterator = node.nodes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
        } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
        }

        var i = _ref;

        if (i.type === 'div') {
            current += 1;
            values[current] = [];
        } else if (i.type === 'word') {
            values[current].push(i.value);
        }
    }

    return values;
}

function insertDecl(decl, prop, value) {
    if (value && !decl.parent.some(function (i) {
        return i.prop === '-ms-' + prop;
    })) {
        decl.cloneBefore({
            prop: '-ms-' + prop,
            value: value.toString()
        });
    }
}

// Transform repeat

function transformRepeat(_ref2) {
    var nodes = _ref2.nodes;

    var repeat = nodes.reduce(function (result, node) {
        if (node.type === 'div' && node.value === ',') {
            result.key = 'function';
        } else {
            result[result.key].push(parser.stringify(node));
        }
        return result;
    }, {
        key: 'count',
        function: [],
        count: []
    });
    return '(' + repeat.function.join('') + ')[' + repeat.count.join('') + ']';
}

function changeRepeat(value) {
    var result = parser(value).nodes.map(function (i) {
        if (i.type === 'function' && i.value === 'repeat') {
            return {
                type: 'word',
                value: transformRepeat(i)
            };
        }
        return i;
    });
    return parser.stringify(result);
}

// Parse grid-template-areas

var DOTS = /^\.+$/;

function track(start, end) {
    return { start: start, end: end, span: end - start };
}

function getColumns(line) {
    return line.trim().split(/\s+/g);
}

function parseGridAreas(rows) {
    return rows.reduce(function (areas, line, rowIndex) {
        if (line.trim() === '') return areas;
        getColumns(line).forEach(function (area, columnIndex) {
            if (DOTS.test(area)) return;
            if (typeof areas[area] === 'undefined') {
                areas[area] = {
                    column: track(columnIndex + 1, columnIndex + 2),
                    row: track(rowIndex + 1, rowIndex + 2)
                };
            } else {
                var _areas$area = areas[area],
                    column = _areas$area.column,
                    row = _areas$area.row;


                column.start = Math.min(column.start, columnIndex + 1);
                column.end = Math.max(column.end, columnIndex + 2);
                column.span = column.end - column.start;

                row.start = Math.min(row.start, rowIndex + 1);
                row.end = Math.max(row.end, rowIndex + 2);
                row.span = row.end - row.start;
            }
        });
        return areas;
    }, {});
}

// Parse grid-template

function testTrack(node) {
    return node.type === 'word' && /^\[.+\]$/.test(node.value);
}

function parseTemplate(decl) {
    var gridTemplate = parser(decl.value).nodes.reduce(function (result, node) {
        var type = node.type,
            value = node.value;


        if (testTrack(node) || type === 'space') return result;

        // area
        if (type === 'string') {
            result.areas.push(value);
        }

        // values and function
        if (type === 'word' || type === 'function') {
            if (type === 'function' && value === 'repeat') {
                result[result.key].push(transformRepeat(node));
            } else {
                result[result.key].push(parser.stringify(node));
            }
        }

        // devider(/)
        if (type === 'div' && value === '/') {
            result.key = 'columns';
        }

        return result;
    }, {
        key: 'rows',
        columns: [],
        rows: [],
        areas: []
    });
    return {
        areas: parseGridAreas(gridTemplate.areas),
        columns: gridTemplate.columns.join(' '),
        rows: gridTemplate.rows.join(' ')
    };
}

// Insert parsed grid areas

function getMSDecls(area) {
    return [].concat({
        prop: '-ms-grid-row',
        value: String(area.row.start)
    }, area.row.span > 1 ? {
        prop: '-ms-grid-row-span',
        value: String(area.row.span)
    } : [], {
        prop: '-ms-grid-column',
        value: String(area.column.start)
    }, area.column.span > 1 ? {
        prop: '-ms-grid-column-span',
        value: String(area.column.span)
    } : []);
}

function getParentMedia(parent) {
    if (parent.type === 'atrule' && parent.name === 'media') {
        return parent;
    } else if (!parent.parent) {
        return false;
    }
    return getParentMedia(parent.parent);
}

function insertAreas(areas, decl, result) {
    var missed = Object.keys(areas);

    var parentMedia = getParentMedia(decl.parent);

    decl.root().walkDecls('grid-area', function (gridArea) {

        var value = gridArea.value;
        var area = areas[value];

        missed = missed.filter(function (e) {
            return e !== value;
        });

        if (area && parentMedia) {

            // skip if grid-template-areas already prefixed in media
            if (parentMedia.some(function (i) {
                return i.selector === gridArea.parent.selector;
            })) {
                return undefined;
            }

            // create new rule
            var rule = decl.parent.clone({
                selector: gridArea.parent.selector
            });
            rule.removeAll();

            // insert prefixed decls in new rule
            getMSDecls(area).forEach(function (i) {
                return rule.append(Object.assign(i, {
                    raws: {
                        between: gridArea.raws.between
                    }
                }));
            });

            // insert new rule with prefixed decl to existing media
            parentMedia.append(rule);

            return undefined;
        }

        if (area) {
            gridArea.parent.walkDecls(/-ms-grid-(row|column)/, function (d) {
                d.remove();
            });

            // insert prefixed decls before grid-area
            getMSDecls(area).forEach(function (i) {
                return gridArea.cloneBefore(i);
            });
        }

        return undefined;
    });

    if (missed.length > 0) {
        decl.warn(result, 'Can not find grid areas: ' + missed.join(', '));
    }
}

module.exports = {
    parse: parse,
    translate: translate,
    changeRepeat: changeRepeat,
    parseTemplate: parseTemplate,
    parseGridAreas: parseGridAreas,
    insertAreas: insertAreas,
    insertDecl: insertDecl
};