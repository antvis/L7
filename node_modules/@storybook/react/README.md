# Storybook for React

Storybook for React is a UI development environment for your React components.
With it, you can visualize different states of your UI components and develop them interactively.

![Storybook Screenshot](https://github.com/storybookjs/storybook/blob/master/media/storybook-intro.gif)

Storybook runs outside of your app.
So you can develop UI components in isolation without worrying about app specific dependencies and requirements.

## Getting Started

```sh
cd my-react-app
npx -p @storybook/cli sb init
```

For more information visit: [storybook.js.org](https://storybook.js.org)

---

Storybook also comes with a lot of [addons](https://storybook.js.org/addons/introduction) and a great API to customize as you wish.
You can also build a [static version](https://storybook.js.org/basics/exporting-storybook) of your storybook and deploy it anywhere you want.

Here are some featured storybooks that you can reference to see how Storybook works:

- [Demo of React Dates](http://airbnb.io/react-dates/) - [source](https://github.com/airbnb/react-dates)
- [Demo of React Native Web](http://necolas.github.io/react-native-web/storybook/) - [source](https://github.com/necolas/react-native-web)

## Create React App

Support for Create React App is handled by [`@storybook/preset-create-react-app`](https://github.com/storybookjs/presets/tree/master/packages/preset-create-react-app).

This preset enables support for all Create React App features, including Sass/SCSS and TypeScript.


## Typescript

If you are using Typescript, make sure you have the type definitions installed via `yarn add @types/node @types/react @types/storybook__react --dev`.

## Docs

- [Basics](https://storybook.js.org/basics/introduction)
- [Configurations](https://storybook.js.org/configurations/default-config)
- [Addons](https://storybook.js.org/addons/introduction)
