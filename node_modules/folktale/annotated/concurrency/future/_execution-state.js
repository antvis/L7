'use strict';

var __metamagical_withMeta = function metamagical_withMeta(object, meta) {
  var parent = Object.getPrototypeOf(object);var oldMeta = object[Symbol.for('@@meta:magical')] || {};if (parent && parent[Symbol.for('@@meta:magical')] === oldMeta) {
    oldMeta = {};
  }Object.keys(meta).forEach(function (key) {
    if (/^~/.test(key)) {
      oldMeta[key.slice(1)] = meta[key];
    } else {
      oldMeta[key] = meta[key];
    }
  });object[Symbol.for('@@meta:magical')] = oldMeta;return object;
},
    _union;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]--------------------------------------------------
var _require = require('../../adt/union'),
    union = _require.union,
    derivations = _require.derivations;

var equality = derivations.equality,
    debugRepresentation = derivations.debugRepresentation;

// --[ Implementation ]------------------------------------------------

/*~ stability: experimental */

var ExecutionState = __metamagical_withMeta(union('folktale:ExecutionState', (_union = {
  Pending: function Pending() {
    return {};
  },
  Cancelled: function Cancelled() {
    return {};
  },
  Resolved: function Resolved(value) {
    return { value: value };
  },
  Rejected: function Rejected(reason) {
    return { reason: reason };
  }
}, __metamagical_withMeta(_union['Pending'], {
  'name': 'Pending',
  'source': 'Pending() {\n    return {};\n  }',
  'signature': 'Pending()',
  'belongsTo': function belongsTo() {
    return ExecutionState;
  }
}), __metamagical_withMeta(_union['Cancelled'], {
  'name': 'Cancelled',
  'source': 'Cancelled() {\n    return {};\n  }',
  'signature': 'Cancelled()',
  'belongsTo': function belongsTo() {
    return ExecutionState;
  }
}), __metamagical_withMeta(_union['Resolved'], {
  'name': 'Resolved',
  'source': 'Resolved(value) {\n    return { value };\n  }',
  'signature': 'Resolved(value)',
  'belongsTo': function belongsTo() {
    return ExecutionState;
  }
}), __metamagical_withMeta(_union['Rejected'], {
  'name': 'Rejected',
  'source': 'Rejected(reason) {\n    return { reason };\n  }',
  'signature': 'Rejected(reason)',
  'belongsTo': function belongsTo() {
    return ExecutionState;
  }
}), _union)).derive(equality, debugRepresentation), {
  'name': 'ExecutionState',
  'source': 'union(\'folktale:ExecutionState\', {\n  /*~\n   */\n  Pending() {\n    return {};\n  },\n\n  /*~\n   */\n  Cancelled() {\n    return {};\n  },\n\n  /*~\n   */\n  Resolved(value) {\n    return { value };\n  },\n\n  /*~\n   */\n  Rejected(reason) {\n    return { reason };\n  }\n}).derive(equality, debugRepresentation)',
  'location': {
    'filename': 'source/concurrency/future/_execution-state.js',
    'start': {
      'line': 19,
      'column': 0
    },
    'end': {
      'line': 43,
      'column': 41
    }
  },
  'module': 'folktale/concurrency/future/_execution-state',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'stability': 'experimental'
});

// --[ Exports ]-------------------------------------------------------
module.exports = ExecutionState;