const { writeFileSync } = require('fs')

const camelCase = require('lodash.camelcase')
const makeDir = require('make-dir')

const sortKeys = require('sort-keys')
const GHE_VERSIONS = [
  '2.14',
  '2.15',
  '2.16',
  '2.17'
]

function normalize (endpoint) {
  endpoint.idName = camelCase(endpoint.idName)
}

GHE_VERSIONS.forEach(version => {
  const routes = require('@octokit/routes/routes/ghe-' + version)
  writeRoutesFiles(version, getRoutes(routes))
})

function getRoutes (routes) {
  Object.keys(routes).forEach(scope => {
    const endpoints = routes[scope]

    // remove legacy endpoints
    const indexes = routes[scope].reduce((result, endpoint, i) => {
      if (/-legacy$/.test(endpoint.idName)) {
        result.unshift(i)
      }

      return result
    }, [])
    indexes.forEach(i => endpoints.splice(i, 1))

    // normalize idName
    endpoints.forEach(normalize)
  })

  return routes
}

function writeRoutesFiles (version, routes) {
  const newRoutes = {}

  const endpoints = Object.keys(routes).reduce((result, scope) => {
    const scopeEndpoints = routes[scope]
    scopeEndpoints.forEach(endpoint => {
      endpoint.scope = scope
    })
    return result.concat(scopeEndpoints)
  }, [])

  endpoints.forEach(endpoint => {
    const scope = endpoint.scope

    if (!newRoutes[scope]) {
      newRoutes[scope] = {}
    }

    const idName = endpoint.idName

    // new route
    newRoutes[scope][idName] = {
      method: endpoint.method,
      headers: endpoint.headers,
      params: endpoint.params.reduce((result, param) => {
        result[param.name] = {
          type: param.type
        }
        if (param.allowNull) {
          result[param.name].allowNull = true
        }
        if (param.required) {
          result[param.name].required = true
        }
        if (param.mapTo) {
          result[param.name].mapTo = param.mapTo === 'input' ? 'data' : param.mapTo

          if (result[param.name].mapTo === 'data' === param.name) {
            delete result[param.name].mapTo
          }
        }
        if (param.enum) {
          result[param.name].enum = param.enum
        }
        if (param.regex) {
          result[param.name].validation = param.regex
        }
        if (param.deprecated) {
          result[param.name].deprecated = true
          result[param.name].alias = param.deprecated.after.name
        }
        return result
      }, {}),
      url: endpoint.path
    }

    const previewHeaders = endpoint.previews
      .filter(preview => preview.required)
      .map(preview => `application/vnd.github.${preview.name}-preview+json`)
      .join(',')

    if (previewHeaders) {
      newRoutes[scope][idName].headers = {
        accept: previewHeaders
      }
    }

    if (endpoint.deprecated) {
      if (endpoint.deprecated.after) {
        newRoutes[scope][idName].deprecated = `octokit.${scope}.${camelCase(endpoint.deprecated.before.idName)}() has been renamed to octokit.${scope}.${camelCase(endpoint.deprecated.after.idName)}() (${endpoint.deprecated.date})`
      } else {
        newRoutes[scope][idName].deprecated = endpoint.deprecated.message
      }
    }
  })

  const newRoutesSorted = sortKeys(newRoutes, { deep: true })
  makeDir.sync(`ghe-${version}`)
  writeFileSync(`ghe-${version}/all.json`, JSON.stringify(newRoutesSorted, null, 2) + '\n')
  writeFileSync(`ghe-${version}/enterprise-admin.json`, JSON.stringify(newRoutesSorted.enterpriseAdmin, null, 2) + '\n')
  writeFileSync(`ghe-${version}/index.js`, `module.exports = (octokit) => octokit.registerEndpoints({ enterpriseAdmin: require('./enterprise-admin.json') })\n`)
  writeFileSync(`ghe-${version}/all.js`, `module.exports = (octokit) => octokit.registerEndpoints(require('./all.json'))\n`)

  writeFileSync(`ghe-${version}/README.md`, `# @octokit/plugin-enterprise-rest/ghe-${version}

## Enterprise Administration

\`\`\`js
${Object.keys(newRoutesSorted.enterpriseAdmin).map(methodName => endpointToMethod('enterpriseAdmin', methodName, newRoutesSorted.enterpriseAdmin[methodName])).join('\n')}
\`\`\`

## Others

\`\`\`js
${Object.keys(newRoutesSorted).filter(scope => scope !== 'enterpriseAdmin').map(scope => Object.keys(newRoutesSorted[scope]).map(methodName => endpointToMethod(scope, methodName, newRoutesSorted[scope][methodName])).join('\n')).join('\n')}
\`\`\`
`)
}

function endpointToMethod (scope, methodName, meta) {
  return `octokit.${scope}.${methodName}(${Object.keys(meta.params).filter(param => !/\./.test(param) && !meta.params[param].deprecated).join(', ')})`
}
