module.exports = transform;
var pathMod = require('path')

function transform (babel) {
  return {
    visitor: {
      ClassDeclaration: function (path, state) {
        if (classHasRenderMethod(path)) {
          setDisplayNameAfter(path, path.node.id, babel.types)
        }
      },
      FunctionDeclaration: function (path, state) {        
        if (doesReturnJSX(path.node.body) || (path.node.id && path.node.id.name &&
                                              isKnownComponent(path.node.id.name, state.opts.knownComponents))) {
          var displayName
          if (path.parentPath.node.type === 'ExportDefaultDeclaration') {
            if (path.node.id == null) {
              // An anonymous function declaration in export default declaration.
              // Transform `export default function () { ... }`
              // to `var _uid1 = function () { .. }; export default __uid;`
              // then add displayName to _uid1  
              var extension = pathMod.extname(state.file.opts.filename) 
              var name = pathMod.basename(state.file.opts.filename, extension)
              
              var id = path.scope.generateUidIdentifier("uid");
              path.node.id = id
              displayName = name
            }
            setDisplayNameAfter(path, path.node.id, babel.types, displayName)
          }else if(path.parentPath.node.type === 'Program' || path.parentPath.node.type == 'ExportNamedDeclaration') {
            setDisplayNameAfter(path, path.node.id, babel.types, displayName)
          }
        }
      },
      FunctionExpression: function (path, state) {
        if(shouldSetDisplayNameForFuncExpr(path, state.opts.knownComponents)) {
          var id = findCandidateNameForExpression(path)
          if (id) {
            setDisplayNameAfter(path, id, babel.types)
          }
        }
      },
      ArrowFunctionExpression: function (path, state) {
        if(shouldSetDisplayNameForFuncExpr(path, state.opts.knownComponents)) {
          var id = findCandidateNameForExpression(path)
          if (id) {
            setDisplayNameAfter(path, id, babel.types)
          }
        }
      }
    }
  }
}

function isKnownComponent(name, knownComponents) {
  return (name && knownComponents && knownComponents.indexOf(name) > -1)
}

function componentNameFromFilename(filename) {
  var extension = pathMod.extname(filename);
  var name = pathMod.basename(filename, extension)
  return name
}

function shouldSetDisplayNameForFuncExpr(path, knownComponents) {
  // Parent must be either 'AssignmentExpression' or 'VariableDeclarator' or 'CallExpression' with a parent of 'VariableDeclarator'
  var id
  if (path.parentPath.node.type === 'AssignmentExpression' &&
      path.parentPath.node.left.type !== 'MemberExpression' && // skip static members 
      path.parentPath.parentPath.node.type == 'ExpressionStatement' &&
      path.parentPath.parentPath.parentPath.node.type == 'Program') {
    id = path.parentPath.node.left
  }else{
    // if parent is a call expression, we have something like (function () { .. })()
    // move up, past the call expression and run the rest of the checks as usual
    if(path.parentPath.node.type === 'CallExpression') {
      path = path.parentPath
    }

    if(path.parentPath.node.type === 'VariableDeclarator') {
      if (path.parentPath.parentPath.parentPath.node.type === 'ExportNamedDeclaration' ||
          path.parentPath.parentPath.parentPath.node.type === 'Program') {
        id = path.parentPath.node.id
      }
    } 
  }

  if (id) {
    if (id.name && isKnownComponent(id.name, knownComponents)) {
      return true
    }
    return doesReturnJSX(path.node.body)
  }

  return false
}

function classHasRenderMethod(path) {
  if(!path.node.body) {
    return false
  }
  var members = path.node.body.body
  for(var i = 0; i < members.length; i++) {
    if (members[i].type == 'ClassMethod' && members[i].key.name == 'render') {
      return true
    }
  }

  return false
}

// https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-react-display-name/src/index.js#L62-L77
// crawl up the ancestry looking for possible candidates for displayName inference
function findCandidateNameForExpression(path) {
  var id
  path.find(function (path) {
    if (path.isAssignmentExpression()) {
      id = path.node.left;
    // } else if (path.isObjectProperty()) {
      // id = path.node.key;
    } else if (path.isVariableDeclarator()) {
      id = path.node.id;
    } else if (path.isStatement()) {
      // we've hit a statement, we should stop crawling up
      return true;
    }

    // we've got an id! no need to continue
    if (id) return true;
  });
  return id
}

function doesReturnJSX (body) {
  if (!body) return false
  if (body.type === 'JSXElement') {
    return true
  }

  var block = body.body
  if (block && block.length) {
    var lastBlock = block.slice(0).pop()

    if (lastBlock.type === 'ReturnStatement') {
      return lastBlock.argument !== null && lastBlock.argument.type === 'JSXElement'
    }
  }

  return false
}

function setDisplayNameAfter(path, nameNodeId, t, displayName) {
  if (!displayName) {
    displayName = nameNodeId.name
  }

  var blockLevelStmnt
  path.find(function (path) {
    if (path.parentPath.isBlock()) {
      blockLevelStmnt = path
      return true
    }
  })

  if (blockLevelStmnt) {
    var trailingComments = blockLevelStmnt.node.trailingComments
    delete blockLevelStmnt.node.trailingComments

    var setDisplayNameStmn = t.expressionStatement(t.assignmentExpression(
      '=',
      t.memberExpression(nameNodeId, t.identifier('displayName')),
      t.stringLiteral(displayName)
    ))

    blockLevelStmnt.insertAfter(setDisplayNameStmn)    
  }
}
