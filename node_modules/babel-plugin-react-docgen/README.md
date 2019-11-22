# babel-plugin-react-docgen

[react-docgen](https://github.com/reactjs/react-docgen) allows you to write propType descriptions, class descriptions and access propType metadata programatically.

This babel plugin allow you to access those information right inside your React class.

For an example, let's say you've a React class like this:

```js
/**
  This is an awesome looking button for React.
*/
import React from 'react';

export default class Button extends React.Component {
  render() {
    const { label, onClick } = this.props;
    return (
      <button onClick={onClick}>{ label }</button>
    );
  }
}

Button.propTypes = {
  /**
    Label for the button.
  */
  label: React.PropTypes.string,

  /**
    Triggered when clicked on the button.
  */
  onClick: React.PropTypes.func,
};
```

With this babel plugin, you can access all these information right inside your app with:

```js
console.log(Button.__docgenInfo);
```
<details>
  <summary>Click to see the output</summary>

  ```js
  {
    description: 'This is an awesome looking button for React.',
    props: {
      label: {
        type: {
          name: 'string'
        },
        required: false,
        description: 'Label for the button.'
      },
      onClick: {
        type: {
          name: 'func'
        },
        required: false,
        description: 'Triggered when clicked on the button.'
      }
    }
  }
  ```
</details>

This will be pretty useful for documentations and some other React devtools like [Storybook](https://github.com/kadirahq/react-storybook).

## Usage

Install the plugin:

```sh
npm install -D babel-plugin-react-docgen
```

Use it inside your `.babelrc`

```json
{
  "plugins": ["react-docgen"]
}
```

## .babelrc Options

|  option  |  description   |  default   |
| --- | --- | --- |
|   resolver  |   [react-docgen](https://github.com/reactjs/react-docgen) has 3 built in resolvers which may be used. Resolvers define how/what the doc generator will inspect. You may inspect the existing resolvers in [react-docgen/tree/master/src/resolver](https://github.com/reactjs/react-docgen/tree/master/src/resolver).  | ```"findAllExportedComponentDefinition"``` |
|   removeMethods  | optionally remove docgen information about methods |   ```false```  |

## Collect All Docgen Info

Sometimes, it's a pretty good idea to collect all of the docgen info into a collection. Then you could use that to render style guide or similar.

So, we allow you to collect all the docgen info into a global collection. To do that, add following config to when loading this babel plugin:

```js
{
  "plugins":[
    [
      "babel-plugin-react-docgen",
      {
        "DOC_GEN_COLLECTION_NAME": "MY_REACT_DOCS",
        "resolver": "findAllComponentDefinitions", // optional (default: findAllComponentDefinitions)
        "removeMethods": true, // optional (default: false)
        "handlers:": ["react-docgen-deprecation-handler"] // optional array of custom handlers (use the string name of the package in the array)
      }
    ]
  ]
}
```

Then you need to create a global variable(an object) in your app called `MY_REACT_DOCS` before any code get's executed.
Then we'll save them into that object. We do it by adding a code block like this to the transpiled file:

```js
if (typeof MY_REACT_DOCS !== 'undefined') {
  MY_REACT_DOCS['test/fixtures/case4/actual.js'] = {
    name: 'Button',
    docgenInfo: Button.__docgenInfo,
    path: 'path/to/my/button.js'
  };
}
```

## Compile Performance

Now, we parse your code with `react-docgen` to get these info.
But we only do it for files which has a React component.

Yes, this will add some overhead to your project. But once you turned on [babel cache directory](http://stackoverflow.com/a/30384710) this won't be a big issue.

## Output Size

Yes this increase the output size of your transpiled files. The size increase varies depending on various factors like:

* How many react classes you've
* Amount of docs you've written
* Amount of propTypes you've

Most of the time, you need this plugin when you are developing your app or with another tool like [Storybook](https://github.com/kadirahq/react-storybook). So, you may not need to use this on the production version of your app.
