"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const Range = require('./util/Range');

const SPECIFICITY = {
  type: 1,
  not: 1,
  oneOf: 1,
  anyOf: 1,
  if: 1,
  enum: 1,
  const: 1,
  instanceof: 1,
  required: 2,
  pattern: 2,
  patternRequired: 2,
  format: 2,
  formatMinimum: 2,
  formatMaximum: 2,
  minimum: 2,
  exclusiveMinimum: 2,
  maximum: 2,
  exclusiveMaximum: 2,
  multipleOf: 2,
  uniqueItems: 2,
  contains: 2,
  minLength: 2,
  maxLength: 2,
  minItems: 2,
  maxItems: 2,
  minProperties: 2,
  maxProperties: 2,
  dependencies: 2,
  propertyNames: 2,
  additionalItems: 2,
  additionalProperties: 2,
  absolutePath: 2
};

function filterMax(array, fn) {
  const evaluatedMax = array.reduce((max, item) => Math.max(max, fn(item)), 0);
  return array.filter(item => fn(item) === evaluatedMax);
}

function filterChildren(children) {
  let newChildren = children;
  newChildren = filterMax(newChildren, error => error.dataPath ? error.dataPath.length : 0);
  newChildren = filterMax(newChildren, error => SPECIFICITY[error.keyword] || 2);
  return newChildren;
}
/**
 * Find all children errors
 * @param children
 * @param {string[]} schemaPaths
 * @return {number} returns index of first child
 */


function findAllChildren(children, schemaPaths) {
  let i = children.length - 1;

  const predicate = schemaPath => children[i].schemaPath.indexOf(schemaPath) !== 0;

  while (i > -1 && !schemaPaths.every(predicate)) {
    if (children[i].keyword === 'anyOf' || children[i].keyword === 'oneOf') {
      const refs = extractRefs(children[i]);
      const childrenStart = findAllChildren(children.slice(0, i), refs.concat(children[i].schemaPath));
      i = childrenStart - 1;
    } else {
      i -= 1;
    }
  }

  return i + 1;
}
/**
 * Extracts all refs from schema
 * @param error
 * @return {string[]}
 */


function extractRefs(error) {
  const {
    schema
  } = error;

  if (!Array.isArray(schema)) {
    return [];
  }

  return schema.map(({
    $ref
  }) => $ref).filter(s => s);
}
/**
 * Groups children by their first level parent (assuming that error is root)
 * @param children
 * @return {any[]}
 */


function groupChildrenByFirstChild(children) {
  const result = [];
  let i = children.length - 1;

  while (i > 0) {
    const child = children[i];

    if (child.keyword === 'anyOf' || child.keyword === 'oneOf') {
      const refs = extractRefs(child);
      const childrenStart = findAllChildren(children.slice(0, i), refs.concat(child.schemaPath));

      if (childrenStart !== i) {
        result.push(Object.assign({}, child, {
          children: children.slice(childrenStart, i)
        }));
        i = childrenStart;
      } else {
        result.push(child);
      }
    } else {
      result.push(child);
    }

    i -= 1;
  }

  if (i === 0) {
    result.push(children[i]);
  }

  return result.reverse();
}

function indent(str, prefix) {
  return str.replace(/\n(?!$)/g, `\n${prefix}`);
}

function isObject(maybyObj) {
  return typeof maybyObj === 'object' && maybyObj !== null;
}

function likeNumber(schema) {
  return schema.type === 'number' || typeof schema.minimum !== 'undefined' || typeof schema.exclusiveMinimum !== 'undefined' || typeof schema.maximum !== 'undefined' || typeof schema.exclusiveMaximum !== 'undefined' || typeof schema.multipleOf !== 'undefined';
}

function likeInteger(schema) {
  return schema.type === 'integer' || typeof schema.minimum !== 'undefined' || typeof schema.exclusiveMinimum !== 'undefined' || typeof schema.maximum !== 'undefined' || typeof schema.exclusiveMaximum !== 'undefined' || typeof schema.multipleOf !== 'undefined';
}

function likeString(schema) {
  return schema.type === 'string' || typeof schema.minLength !== 'undefined' || typeof schema.maxLength !== 'undefined' || typeof schema.pattern !== 'undefined' || typeof schema.format !== 'undefined' || typeof schema.formatMinimum !== 'undefined' || typeof schema.formatMaximum !== 'undefined';
}

function likeBoolean(schema) {
  return schema.type === 'boolean';
}

function likeArray(schema) {
  return schema.type === 'array' || typeof schema.minItems === 'number' || typeof schema.maxItems === 'number' || typeof schema.uniqueItems !== 'undefined' || typeof schema.items !== 'undefined' || typeof schema.additionalItems !== 'undefined' || typeof schema.contains !== 'undefined';
}

function likeObject(schema) {
  return schema.type === 'object' || typeof schema.minProperties !== 'undefined' || typeof schema.maxProperties !== 'undefined' || typeof schema.required !== 'undefined' || typeof schema.properties !== 'undefined' || typeof schema.patternProperties !== 'undefined' || typeof schema.additionalProperties !== 'undefined' || typeof schema.dependencies !== 'undefined' || typeof schema.propertyNames !== 'undefined' || typeof schema.patternRequired !== 'undefined';
}

function likeNull(schema) {
  return schema.type === 'null';
}

function getArticle(type) {
  if (/^[aeiou]/i.test(type)) {
    return 'an';
  }

  return 'a';
}

function getSchemaNonTypes(schema) {
  if (!schema.type) {
    if (likeNumber(schema) || likeInteger(schema)) {
      return ' | should be any non-number';
    }

    if (likeString(schema)) {
      return ' | should be any non-string';
    }

    if (likeArray(schema)) {
      return ' | should be any non-array';
    }

    if (likeObject(schema)) {
      return ' | should be any non-object';
    }
  }

  return '';
}

function numberHints(schema) {
  const hints = [];
  const range = new Range();

  if (typeof schema.minimum === 'number') {
    range.left(schema.minimum);
  }

  if (typeof schema.exclusiveMinimum === 'number') {
    range.left(schema.exclusiveMinimum, true);
  }

  if (typeof schema.maximum === 'number') {
    range.right(schema.maximum);
  }

  if (typeof schema.exclusiveMaximum === 'number') {
    range.right(schema.exclusiveMaximum, true);
  }

  const rangeFormat = range.format();

  if (rangeFormat) {
    hints.push(rangeFormat);
  }

  if (typeof schema.multipleOf === 'number') {
    hints.push(`should be multiple of ${schema.multipleOf}`);
  }

  return hints;
}

function formatHints(hints) {
  return hints.length > 0 ? `(${hints.join(', ')})` : '';
}

function getHints(schema) {
  if (likeNumber(schema) || likeInteger(schema)) {
    return formatHints(numberHints(schema));
  }

  return '';
}

class ValidationError extends Error {
  constructor(errors, schema, configuration = {}) {
    super();
    this.name = 'ValidationError';
    this.errors = errors;
    this.schema = schema;
    this.headerName = configuration.name || 'Object';
    this.baseDataPath = configuration.baseDataPath || 'configuration';
    this.postFormatter = configuration.postFormatter || null;
    const header = `Invalid ${this.baseDataPath} object. ${this.headerName} has been initialised using ${getArticle(this.baseDataPath)} ${this.baseDataPath} object that does not match the API schema.\n`;
    this.message = `${header}${this.formatValidationErrors(errors)}`;
    Error.captureStackTrace(this, this.constructor);
  }

  getSchemaPart(path) {
    const newPath = path.split('/');
    let schemaPart = this.schema;

    for (let i = 1; i < newPath.length; i++) {
      const inner = schemaPart[newPath[i]];

      if (!inner) {
        break;
      }

      schemaPart = inner;
    }

    return schemaPart;
  }

  formatSchema(schema, prevSchemas = []) {
    const formatInnerSchema = (innerSchema, addSelf) => {
      if (!addSelf) {
        return this.formatSchema(innerSchema, prevSchemas);
      }

      if (prevSchemas.includes(innerSchema)) {
        return '(recursive)';
      }

      return this.formatSchema(innerSchema, prevSchemas.concat(schema));
    };

    if (schema.not && !likeObject(schema)) {
      return `non ${formatInnerSchema(schema.not)}`;
    }

    if (schema.instanceof) {
      if (Array.isArray(schema.instanceof)) {
        return schema.instanceof.map(formatInnerSchema).join(' | ');
      } // eslint-disable-next-line default-case


      switch (schema.instanceof) {
        case 'Function':
          return 'function';

        case 'RegExp':
          return 'RegExp';
      }
    }

    if (schema.enum) {
      return schema.enum.map(item => JSON.stringify(item)).join(' | ');
    }

    if (typeof schema.const !== 'undefined') {
      return JSON.stringify(schema.const);
    }

    if (schema.oneOf) {
      return schema.oneOf.map(formatInnerSchema).join(' | ');
    }

    if (schema.anyOf) {
      return schema.anyOf.map(formatInnerSchema).join(' | ');
    }

    if (schema.allOf) {
      return schema.allOf.map(formatInnerSchema).join(' & ');
    }

    if (schema.if) {
      return `if ${formatInnerSchema(schema.if)} then ${formatInnerSchema(schema.then)}${schema.else ? ` else ${formatInnerSchema(schema.else)}` : ''}`;
    }

    if (schema.$ref) {
      return formatInnerSchema(this.getSchemaPart(schema.$ref), true);
    }

    if (likeNumber(schema) || likeInteger(schema)) {
      const type = schema.type === 'integer' ? 'integer' : 'number';
      const hints = getHints(schema);
      return `${type}${hints.length > 0 ? ` ${hints}` : ''}`;
    }

    if (likeString(schema)) {
      let type = 'string';
      const hints = [];

      if (typeof schema.minLength === 'number') {
        if (schema.minLength === 1) {
          type = 'non-empty string';
        } else if (schema.minLength !== 0) {
          /* if min length === 0 it does not make hint for user */
          const length = schema.minLength - 1;
          hints.push(`should be longer than ${length} character${length > 1 ? 's' : ''}`);
        }
      }

      if (typeof schema.maxLength === 'number') {
        if (schema.maxLength === 0) {
          type = 'empty string';
        } else {
          hints.push(`should be shorter than ${schema.maxLength + 1} characters`);
        }
      }

      if (schema.pattern) {
        hints.push(`should match pattern ${JSON.stringify(schema.pattern)}`);
      }

      if (schema.format) {
        hints.push(`should match format ${JSON.stringify(schema.format)}`);
      }

      if (schema.formatMinimum) {
        hints.push(`should be ${schema.formatExclusiveMinimum ? '>' : '>='} ${JSON.stringify(schema.formatMinimum)}`);
      }

      if (schema.formatMaximum) {
        hints.push(`should be ${schema.formatExclusiveMaximum ? '<' : '<='} ${JSON.stringify(schema.formatMaximum)}`);
      }

      return `${type}${hints.length > 0 ? ` (${hints.join(', ')})` : ''}`;
    }

    if (likeBoolean(schema)) {
      return 'boolean';
    }

    if (likeArray(schema)) {
      const hints = [];

      if (typeof schema.minItems === 'number') {
        hints.push(`should not have fewer than ${schema.minItems} item${schema.minItems > 1 ? 's' : ''}`);
      }

      if (typeof schema.maxItems === 'number') {
        hints.push(`should not have more than ${schema.maxItems} item${schema.maxItems > 1 ? 's' : ''}`);
      }

      if (schema.uniqueItems) {
        hints.push('should not have duplicate items');
      }

      const hasAdditionalItems = typeof schema.additionalItems === 'undefined' || Boolean(schema.additionalItems);
      let items = '';

      if (schema.items) {
        if (Array.isArray(schema.items) && schema.items.length > 0) {
          items = `${schema.items.map(formatInnerSchema).join(', ')}`;

          if (hasAdditionalItems) {
            if (isObject(schema.additionalItems) && Object.keys(schema.additionalItems).length > 0) {
              hints.push(`additional items should be ${formatInnerSchema(schema.additionalItems)}`);
            }
          }
        } else if (schema.items && Object.keys(schema.items).length > 0) {
          // "additionalItems" is ignored
          items = `${formatInnerSchema(schema.items)}`;
        } else {
          // Fallback for empty `items` value
          items = 'any';
        }
      } else {
        // "additionalItems" is ignored
        items = 'any';
      }

      if (schema.contains && Object.keys(schema.contains).length > 0) {
        hints.push(`should contains at least one ${this.formatSchema(schema.contains)} item`);
      }

      return `[${items}${hasAdditionalItems ? ', ...' : ''}]${hints.length > 0 ? ` (${hints.join(', ')})` : ''}`;
    }

    if (likeObject(schema)) {
      const hints = [];

      if (typeof schema.minProperties === 'number') {
        hints.push(`should not have fewer than ${schema.minProperties} ${schema.minProperties > 1 ? 'properties' : 'property'}`);
      }

      if (typeof schema.maxProperties === 'number') {
        hints.push(`should not have more than ${schema.maxProperties} ${schema.minProperties > 1 ? 'properties' : 'property'}`);
      }

      if (schema.patternProperties && Object.keys(schema.patternProperties).length > 0) {
        const patternProperties = Object.keys(schema.patternProperties);
        hints.push(`additional property names should match pattern${patternProperties.length > 1 ? 's' : ''} ${patternProperties.map(pattern => JSON.stringify(pattern)).join(' | ')}`);
      }

      const properties = schema.properties ? Object.keys(schema.properties) : [];
      const required = schema.required ? schema.required : [];
      const allProperties = [...new Set([].concat(required).concat(properties))];
      const hasAdditionalProperties = typeof schema.additionalProperties === 'undefined' || Boolean(schema.additionalProperties);
      const objectStructure = allProperties.map(property => {
        const isRequired = required.includes(property); // Some properties need quotes, maybe we should add check
        // Maybe we should output type of property (`foo: string`), but it is looks very unreadable

        return `${property}${isRequired ? '' : '?'}`;
      }).concat(hasAdditionalProperties ? isObject(schema.additionalProperties) ? [`<key>: ${formatInnerSchema(schema.additionalProperties)}`] : ['…'] : []).join(', ');

      if (schema.dependencies) {
        Object.keys(schema.dependencies).forEach(dependencyName => {
          const dependency = schema.dependencies[dependencyName];

          if (Array.isArray(dependency)) {
            hints.push(`should have ${dependency.length > 1 ? 'properties' : 'property'} ${dependency.map(dep => `'${dep}'`).join(', ')} when property '${dependencyName}' is present`);
          } else {
            hints.push(`should be valid according to the schema ${formatInnerSchema(dependency)} when property '${dependencyName}' is present`);
          }
        });
      }

      if (schema.propertyNames && Object.keys(schema.propertyNames).length > 0) {
        hints.push(`each property name should match format ${JSON.stringify(schema.propertyNames.format)}`);
      }

      if (schema.patternRequired && schema.patternRequired.length > 0) {
        hints.push(`should have property matching pattern ${schema.patternRequired.map(item => JSON.stringify(item))}`);
      }

      return `object {${objectStructure ? ` ${objectStructure} ` : ''}}${hints.length > 0 ? ` (${hints.join(', ')})` : ''}`;
    }

    if (likeNull(schema)) {
      return 'null';
    }

    if (Array.isArray(schema.type)) {
      return `${schema.type.map(item => item).join(' | ')}`;
    } // Fallback for unknown keywords

    /* istanbul ignore next */


    return JSON.stringify(schema, null, 2);
  }

  getSchemaPartText(schemaPart, additionalPath, needDot = false) {
    if (additionalPath) {
      for (let i = 0; i < additionalPath.length; i++) {
        const inner = schemaPart[additionalPath[i]];

        if (inner) {
          // eslint-disable-next-line no-param-reassign
          schemaPart = inner;
        } else {
          break;
        }
      }
    }

    while (schemaPart.$ref) {
      // eslint-disable-next-line no-param-reassign
      schemaPart = this.getSchemaPart(schemaPart.$ref);
    }

    let schemaText = `${this.formatSchema(schemaPart)}${needDot ? '.' : ''}`;

    if (schemaPart.description) {
      schemaText += `\n-> ${schemaPart.description}`;
    }

    return schemaText;
  }

  getSchemaPartDescription(schemaPart) {
    while (schemaPart.$ref) {
      // eslint-disable-next-line no-param-reassign
      schemaPart = this.getSchemaPart(schemaPart.$ref);
    }

    if (schemaPart.description) {
      return `\n-> ${schemaPart.description}`;
    }

    return '';
  }

  formatValidationError(error) {
    const dataPath = `${this.baseDataPath}${error.dataPath}`;

    switch (error.keyword) {
      case 'type':
        // eslint-disable-next-line default-case
        switch (error.params.type) {
          case 'number':
            return `${dataPath} should be a ${this.getSchemaPartText(error.parentSchema, false, true)}`;

          case 'integer':
            return `${dataPath} should be a ${this.getSchemaPartText(error.parentSchema, false, true)}`;

          case 'string':
            return `${dataPath} should be a ${this.getSchemaPartText(error.parentSchema, false, true)}`;

          case 'boolean':
            return `${dataPath} should be a ${this.getSchemaPartText(error.parentSchema, false, true)}`;

          case 'array':
            return `${dataPath} should be an array:\n${this.getSchemaPartText(error.parentSchema)}`;

          case 'object':
            return `${dataPath} should be an object:\n${this.getSchemaPartText(error.parentSchema)}`;

          case 'null':
            return `${dataPath} should be a ${this.getSchemaPartText(error.parentSchema, false, true)}`;

          default:
            return `${dataPath} should be:\n${this.getSchemaPartText(error.parentSchema)}`;
        }

      case 'instanceof':
        return `${dataPath} should be an instance of ${this.getSchemaPartText(error.parentSchema)}.`;

      case 'pattern':
        return `${dataPath} should match pattern ${JSON.stringify(error.params.pattern)}${getSchemaNonTypes(error.parentSchema)}.${this.getSchemaPartDescription(error.parentSchema)}`;

      case 'format':
        return `${dataPath} should match format ${JSON.stringify(error.params.format)}${getSchemaNonTypes(error.parentSchema)}.${this.getSchemaPartDescription(error.parentSchema)}`;

      case 'formatMinimum':
      case 'formatMaximum':
        return `${dataPath} should be ${error.params.comparison} ${JSON.stringify(error.params.limit)}${getSchemaNonTypes(error.parentSchema)}.${this.getSchemaPartDescription(error.parentSchema)}`;

      case 'minimum':
      case 'maximum':
      case 'exclusiveMinimum':
      case 'exclusiveMaximum':
        {
          const hints = numberHints(error.parentSchema);

          if (hints.length === 0) {
            hints.push(`should be ${error.params.comparison} ${error.params.limit}`);
          }

          return `${dataPath} ${hints.join(' ')}${getSchemaNonTypes(error.parentSchema)}.${this.getSchemaPartDescription(error.parentSchema)}`;
        }

      case 'multipleOf':
        return `${dataPath} should be multiple of ${error.params.multipleOf}${getSchemaNonTypes(error.parentSchema)}.${this.getSchemaPartDescription(error.parentSchema)}`;

      case 'patternRequired':
        return `${dataPath} should have property matching pattern ${JSON.stringify(error.params.missingPattern)}${getSchemaNonTypes(error.parentSchema)}.${this.getSchemaPartDescription(error.parentSchema)}`;

      case 'minLength':
        {
          if (error.params.limit === 1) {
            return `${dataPath} should be an non-empty string${getSchemaNonTypes(error.parentSchema)}.${this.getSchemaPartDescription(error.parentSchema)}`;
          }

          const length = error.params.limit - 1;
          return `${dataPath} should be longer than ${length} character${length > 1 ? 's' : ''}${getSchemaNonTypes(error.parentSchema)}.${this.getSchemaPartDescription(error.parentSchema)}`;
        }

      case 'minItems':
        {
          if (error.params.limit === 1) {
            return `${dataPath} should be an non-empty array${getSchemaNonTypes(error.parentSchema)}.${this.getSchemaPartDescription(error.parentSchema)}`;
          }

          return `${dataPath} should not have fewer than ${error.params.limit} items${getSchemaNonTypes(error.parentSchema)}.${this.getSchemaPartDescription(error.parentSchema)}`;
        }

      case 'minProperties':
        {
          if (error.params.limit === 1) {
            return `${dataPath} should be an non-empty object${getSchemaNonTypes(error.parentSchema)}.${this.getSchemaPartDescription(error.parentSchema)}`;
          }

          return `${dataPath} should not have fewer than ${error.params.limit} properties${getSchemaNonTypes(error.parentSchema)}.${this.getSchemaPartDescription(error.parentSchema)}`;
        }

      case 'maxLength':
        return `${dataPath} should be shorter than ${error.params.limit + 1} characters${getSchemaNonTypes(error.parentSchema)}.${this.getSchemaPartDescription(error.parentSchema)}`;

      case 'maxItems':
        return `${dataPath} should not have more than ${error.params.limit} items${getSchemaNonTypes(error.parentSchema)}.${this.getSchemaPartDescription(error.parentSchema)}`;

      case 'maxProperties':
        return `${dataPath} should not have more than ${error.params.limit} properties${getSchemaNonTypes(error.parentSchema)}.${this.getSchemaPartDescription(error.parentSchema)}`;

      case 'uniqueItems':
        return `${dataPath} should not contain the item '${error.data[error.params.i]}' twice${getSchemaNonTypes(error.parentSchema)}.${this.getSchemaPartDescription(error.parentSchema)}`;

      case 'additionalItems':
        return `${dataPath} should not have more than ${error.params.limit} items${getSchemaNonTypes(error.parentSchema)}. These items are valid:\n${this.getSchemaPartText(error.parentSchema)}`;

      case 'contains':
        return `${dataPath} should contains at least one ${this.getSchemaPartText(error.parentSchema, ['contains'])} item${getSchemaNonTypes(error.parentSchema)}.`;

      case 'required':
        {
          const missingProperty = error.params.missingProperty.replace(/^\./, '');
          const hasProperty = Boolean(error.parentSchema.properties && error.parentSchema.properties[missingProperty]);
          return `${dataPath} misses the property '${missingProperty}'${getSchemaNonTypes(error.parentSchema)}.${hasProperty ? ` Should be:\n${this.getSchemaPartText(error.parentSchema, ['properties', missingProperty])}` : this.getSchemaPartDescription(error.parentSchema)}`;
        }

      case 'additionalProperties':
        return `${dataPath} has an unknown property '${error.params.additionalProperty}'${getSchemaNonTypes(error.parentSchema)}. These properties are valid:\n${this.getSchemaPartText(error.parentSchema)}`;

      case 'dependencies':
        {
          const dependencies = error.params.deps.split(',').map(dep => `'${dep.trim()}'`).join(', ');
          return `${dataPath} should have properties ${dependencies} when property '${error.params.property}' is present${getSchemaNonTypes(error.parentSchema)}.${this.getSchemaPartDescription(error.parentSchema)}`;
        }

      case 'propertyNames':
        {
          return `${dataPath} property name '${error.params.propertyName}' is invalid${getSchemaNonTypes(error.parentSchema)}. Property names should be match format ${JSON.stringify(error.schema.format)}.${this.getSchemaPartDescription(error.parentSchema)}`;
        }

      case 'enum':
        {
          if (error.parentSchema && error.parentSchema.enum && error.parentSchema.enum.length === 1) {
            return `${dataPath} should be ${this.getSchemaPartText(error.parentSchema, false, true)}`;
          }

          return `${dataPath} should be one of these:\n${this.getSchemaPartText(error.parentSchema)}`;
        }

      case 'const':
        return `${dataPath} should be equal to constant ${this.getSchemaPartText(error.parentSchema)}`;

      case 'not':
        return `${dataPath} should not be ${this.getSchemaPartText(error.schema)}${likeObject(error.parentSchema) ? `\n${this.getSchemaPartText(error.parentSchema)}` : ''}`;

      case 'oneOf':
      case 'anyOf':
        {
          if (error.children && error.children.length > 0) {
            if (error.schema.length === 1) {
              const lastChild = error.children[error.children.length - 1];
              const remainingChildren = error.children.slice(0, error.children.length - 1);
              return this.formatValidationError(Object.assign({}, lastChild, {
                children: remainingChildren,
                parentSchema: Object.assign({}, error.parentSchema, lastChild.parentSchema)
              }));
            }

            let children = filterChildren(error.children);

            if (children.length === 1) {
              return this.formatValidationError(children[0]);
            }

            children = groupChildrenByFirstChild(children);
            return `${dataPath} should be one of these:\n${this.getSchemaPartText(error.parentSchema)}\nDetails:\n${children.map(nestedError => ` * ${indent(this.formatValidationError(nestedError), '   ')}`).join('\n')}`;
          }

          return `${dataPath} should be one of these:\n${this.getSchemaPartText(error.parentSchema)}`;
        }

      case 'if':
        return `${dataPath} should match "${error.params.failingKeyword}" schema:\n${this.getSchemaPartText(error.parentSchema, [error.params.failingKeyword])}`;

      case 'absolutePath':
        return `${dataPath}: ${error.message}${this.getSchemaPartDescription(error.parentSchema)}`;

      default:
        // For `custom`, `false schema`, `$ref` keywords
        // Fallback for unknown keywords

        /* istanbul ignore next */
        return `${dataPath} ${error.message} (${JSON.stringify(error, null, 2)}).\n${this.getSchemaPartText(error.parentSchema)}`;
    }
  }

  formatValidationErrors(errors) {
    return errors.map(error => {
      let formattedError = this.formatValidationError(error, this.schema);

      if (this.postFormatter) {
        formattedError = this.postFormatter(formattedError, error);
      }

      return ` - ${indent(formattedError, '   ')}`;
    }).join('\n');
  }

}

var _default = ValidationError;
exports.default = _default;