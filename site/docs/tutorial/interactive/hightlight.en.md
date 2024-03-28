---
title: HightLight
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

In addition to data display, geographical visualization also requires user interaction. User interaction is generally divided into two types.

- Layer interaction
- Data interaction

### Layer interaction

The mouse performs related operations on the visualization layer, and the layer will respond accordingly.`L7`of`Layer`Layers currently natively support two interaction capabilities.

- `active`Mouse over highlight
- `select`Mouse selection highlight

#### active(activeOption | boolean): void

- Turn on or off`mousehover`Element highlighting effect.
- `activeOption`
  - `color`: Highlight color
  - `mix`: Optional parameter, the default is 0, which means the highlight color is the specified solid color. The maximum valid value is 1, which means the highlight color is all the background color.

```javascript
// Turn on Active and use the default highlight color
layer.active(true);

// Turn on Active custom highlight color

layer.active({
  color: 'red',
  mix: 0.6,
});

//Turn off the highlight effect
layer.active(false);
```

#### select(selectOption | boolean): void

- Turn on or off`mouseclick`Element selection highlight effect.
- `selectOption`
  - `color`: Select highlight color
  - `mix`: Optional parameter, the default is 0, which means that the selected highlight color is the specified solid color. The maximum effective value is 1, which means that all the selected highlight colors are background colors.

```javascript
// Turn on Active and use the default highlight color
layer.select(true);

// Turn on Active custom highlight color

layer.select({
  color: 'red',
  mix: 0.6,
});

//Turn off the highlight effect
layer.select(false);
```

### Data interaction

Sometimes we may need to directly specify a certain data highlight. For example, when the mouse clicks on the data in the data panel, we need to highlight the corresponding element of the map.

#### setActive(id: number): void

```javascript
layer.setActive(id);
```

#### setSelect(id: number): void

```javascript
layer.setSelect(id);
```
