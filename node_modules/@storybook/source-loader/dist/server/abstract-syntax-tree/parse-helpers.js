"use strict";

require("core-js/modules/es.array.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchNode = patchNode;
exports.handleExportedName = handleExportedName;
exports.handleADD = handleADD;
exports.handleSTORYOF = handleSTORYOF;
exports.asImport = asImport;

const {
  toId
} = require('@storybook/router/utils');

const STORIES_OF = 'storiesOf';

function pushParts(source, parts, from, to) {
  const start = source.slice(from, to);
  parts.push(start);
  const end = source.slice(to);
  parts.push(end);
}

function getKindFromStoryOfNode(object) {
  if (object.arguments.length < 1) {
    return '';
  }

  const kindArgument = object.arguments[0];

  if (kindArgument.type === 'Literal' || kindArgument.type === 'StringLiteral') {
    return kindArgument.value;
  }

  if (kindArgument.type === 'TemplateLiteral') {
    // we can generate template, but it will not be a real value
    // until the full template compilation. probably won't fix.
    return '';
  } // other options may include some complex usages.


  return '';
}

function findRelatedKind(object) {
  if (!object || !object.callee) {
    return '';
  }

  if (object.callee.name === STORIES_OF) {
    return getKindFromStoryOfNode(object);
  }

  return findRelatedKind(object.callee.object);
}

function patchNode(node) {
  if (node.range && node.range.length === 2 && node.start === undefined && node.end === undefined) {
    const [start, end] = node.range; // eslint-disable-next-line no-param-reassign

    node.start = start; // eslint-disable-next-line no-param-reassign

    node.end = end;
  }

  if (!node.range && node.start !== undefined && node.end !== undefined) {
    // eslint-disable-next-line no-param-reassign
    node.range = [node.start, node.end];
  }

  return node;
}

function handleExportedName(kind, storyName, node) {
  const startLoc = {
    col: node.loc.start.column,
    line: node.loc.start.line
  };
  const endLoc = {
    col: node.loc.end.column,
    line: node.loc.end.line
  };
  return {
    [toId(kind, storyName)]: {
      startLoc,
      endLoc,
      startBody: startLoc,
      endBody: endLoc
    }
  };
}

function handleADD(node, parent, storiesOfIdentifiers) {
  if (!node.property || !node.property.name || node.property.name.indexOf('add') !== 0) {
    return {};
  }

  const addArgs = parent.arguments;

  if (!addArgs || addArgs.length < 2) {
    return {};
  }

  let tmp = node.object;

  while (tmp.callee && tmp.callee.object) {
    tmp = tmp.callee.object;
  }

  const framework = tmp.callee && tmp.callee.name && storiesOfIdentifiers[tmp.callee.name];
  const storyName = addArgs[0];
  const body = addArgs[1];
  const lastArg = addArgs[addArgs.length - 1];

  if (storyName.type !== 'Literal' && storyName.type !== 'StringLiteral') {
    // if story name is not literal, it's much harder to extract it
    return {};
  }

  const kind = findRelatedKind(node.object) || '';

  if (kind && storyName.value) {
    const key = toId(kind, storyName.value);
    let idToFramework;

    if (key && framework) {
      idToFramework = {
        [key]: framework
      };
    }

    return {
      toAdd: {
        [key]: {
          // Debug: code: source.slice(storyName.start, lastArg.end),
          startLoc: {
            col: storyName.loc.start.column,
            line: storyName.loc.start.line
          },
          endLoc: {
            col: lastArg.loc.end.column,
            line: lastArg.loc.end.line
          },
          startBody: {
            col: body.loc.start.column,
            line: body.loc.start.line
          },
          endBody: {
            col: body.loc.end.column,
            line: body.loc.end.line
          }
        }
      },
      idToFramework
    };
  }

  return {};
}

function handleSTORYOF(node, parts, source, lastIndex) {
  if (!node.callee || !node.callee.name || node.callee.name !== STORIES_OF) {
    return lastIndex;
  }

  parts.pop();
  pushParts(source, parts, lastIndex, node.end);
  return node.end;
}

function asImport(node) {
  return node.source.value;
}