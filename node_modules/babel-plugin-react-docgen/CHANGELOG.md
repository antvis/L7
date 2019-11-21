# ChangeLog

### v3.1.0
16-04-2019

New Features:
* Add support for custom React Docgen handlers #64, #65

### v3.0.0
27-03-2019

Breaking changes:
* Upgrade to `react-docgen@4.1.0`

Bug fixes:
* Fixes #67 where `forwardRef` wrapped components are not detected
* Upgrade to `lodash@4.17.10` to fix security vulnerability

### v2.0.2
29-01-2019

* Fixes #62 where `recast` is not in the right dependency tree

### v2.0.1
29-01-2019

* Updated to use release version of `react-docgen@^3.0.0`

### v2.0.0

Breaking changes:
* Use `findAllExportedComponentDefinitions` by default to generate info for named exports
* Default to not remove method info and changed `.babelrc` key to `removeMethods`

Bug fixes:
* Fix for named export using incorrect local name in `export default ComponentName`
[PR38](https://github.com/storybooks/babel-plugin-react-docgen/pull/38)
* Relies on `react-docgen` for more React component detection functionalities
[PR54](https://github.com/storybooks/babel-plugin-react-docgen/pull/54)
* Fix crash on `name`
[PR58](https://github.com/storybooks/babel-plugin-react-docgen/pull/58)
* Upgraded to Babel 7 and react-docgen 3.0-rc.1
[PR59](https://github.com/storybooks/babel-plugin-react-docgen/pull/59)

### v1.9.0
04-April-2018

* Use react-docgen 3.0-beta for enhanced Flow support

### v1.8.3
28-February-2018

* Add support for `module.exports = className` declaration
[PR47](https://github.com/storybooks/babel-plugin-react-docgen/pull/44)

### v1.8.2

14-January-2018
* Add support for stateless functional components declared as `function(){ }`
[PR41](https://github.com/storybooks/babel-plugin-react-docgen/pull/41)

### v1.8.1
24-September-2017

* Suppress errors caught during babel traversal
[PR37](https://github.com/storybooks/babel-plugin-react-docgen/pull/37)

### v1.8.0
24-September-2017

* Add support for custom resolvers
* Add option to keep method info from docgen
[PR35](https://github.com/storybooks/babel-plugin-react-docgen/pull/35)

### v1.7.0
11-August-2017

* Add support for Higher Order Components with arbitrary depth
[PR32](https://github.com/storybooks/babel-plugin-react-docgen/pull/32)

### v1.6.0
26-July-2017

* Add support for React.createElement
[PR31](https://github.com/storybooks/babel-plugin-react-docgen/pull/31)

### v1.5.0
06-June-2017

* Uses docgen 2.15.0 and babel-types 6.24.1
* Add support for components created with React.createClass or createReactClass [PR27](https://github.com/storybooks/babel-plugin-react-docgen/pull/27)

### v1.4.2
03-January-2017

Add support for hypen propTypes.

### v1.4.1
03-November-2016

Fixes [#19](https://github.com/kadirahq/babel-plugin-react-docgen/pull/20)

### v1.4.0
01-November-2016

Handle multiple components in the same file by checking with exported classes. [PR17](https://github.com/kadirahq/babel-plugin-react-docgen/pull/17)

### v1.3.1
23-October-2016

* Restrict JSX lookup only for direct JSX returns. [PR15](https://github.com/kadirahq/babel-plugin-react-docgen/pull/15)

### v1.3.1
21-October-2016

Update the `react-docgen` NPM module to the latest as they [fixed](https://github.com/reactjs/react-docgen/issues/131) the bug related to default values.

### v1.3.0
20-October-2016

* Use docgen version 2.11.0. [PR11](https://github.com/kadirahq/babel-plugin-react-docgen/pull/11)
* Rename DOC_GEN_GLOBAL to DOC_GEN_COLLECTION_NAME. [PR12](https://github.com/kadirahq/babel-plugin-react-docgen/pull/12)
* Update the README. [PR13](https://github.com/kadirahq/babel-plugin-react-docgen/pull/13)

### v1.1.0
20-October-2016

Initial public release.

### v1.2.0
20-October-2016

* Stateless component support
* Global object with all the component docs
* `__docgenInfo` is now an actual object instead of a JSON string
