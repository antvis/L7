# babel-plugin-add-react-displayname

Automatically detects and sets displayName for React components. 
This is useful for having real component names show up in production builds of React apps.

Babel already does this for `React.createClass` style components, this adds support for the two other kinds of component definitions:
 * ES6-classes style components
 * Stateless components that return JSX


## Installation
Simply add `add-react-displayname` to your `.babelrc` file:

```json
{
    "plugins": ["add-react-displayname"]
}
```

## Troubleshooting

#### Doesn't work for decorated classes

If you are using the `transform-decorators-legacy` plugin, make sure it's placed *after* this plugin in your plugin list. 

## Testing

`npm test`
