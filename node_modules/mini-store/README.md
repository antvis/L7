# mini-store

[![Travis](https://img.shields.io/travis/yesmeck/mini-store.svg?style=flat-square)](https://travis-ci.org/yesmeck/mini-store)

A state store for React component.

## Motivation

When you want to share a component's state to another one, a commom pattern in React world is [lifting state up](https://reactjs.org/docs/lifting-state-up.html#lifting-state-up). But one problem of this pattern is performance, assume we have a component in following hierarchy:

```javascript
<Parent>
  <ChildA />
  <ChildB />
  <ChildC />
</Parent>
```

`ChildA` want to share state with `ChildB`, so you lifting `ChildA`'s state up to `Parent`. Now, when `ChildA`'s state changes, the whole `Parent` will rerender, includes `ChildC` which should not happen.

Redux do a good job at this situation throgh keeping all state in store, then component can subscribe state's changes, and only connected components will rerender. But `redux` + `react-redux` is overkill when you are writing a component library. So I wrote this little library, It's like Redux's store without "reducer" and "dispatch".

## Example

[See this demo online.](https://codesandbox.io/s/mq6223x08p)

```javascript
import { Provider, create, connect } from 'mini-store';

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.store = create({
      count: 0,
    });
  }

  render() {
    return (
      <Provider store={this.store}>
        <div>
          <Buttons />
          <Result />
        </div>
      </Provider>
    )
  }
}

@connect()
class Buttons extends React.Component {
  handleClick = (step) => () => {
    const { store } = this.props;
    const { count } = store.getState();
    store.setState({ count: count + step });
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick(1)}>+</button>
        <button onClick={this.handleClick(-1)}>-</button>
      </div>
    );
  }
}

@connect((state) => ({ count: state.count }))
class Result extends React.Component {
  render() {
    return (
      <div>{this.props.count}</div>
    );
  };
}
```

## API

### `create(initialState)`

Creates a store that holds the state. `initialState` is plain object.

### `<Provider store>`

Makes the store available to the connect() calls in the component hierarchy below.

### `connect(mapStateToProps)`

Connects a React component to the store. It works like Redux's `connect`, but only accept `mapStateToProps`. The connected component also receive `store` as a prop, you can call `setState` directly on store.

## License

MIT
