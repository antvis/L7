# MARTINI

[![Build Status](https://travis-ci.com/mapbox/martini.svg?branch=master)](https://travis-ci.com/mapbox/martini) [![Simply Awesome](https://img.shields.io/badge/simply-awesome-brightgreen.svg)](https://github.com/mourner/projects)

MARTINI stands for **Mapbox's Awesome Right-Triangulated Irregular Networks, Improved**.

It's an experimental JavaScript library for **real-time terrain mesh generation** from height data. Given a (2<sup>k</sup>+1) × (2<sup>k</sup>+1) terrain grid, it generates a hierarchy of triangular meshes of varying level of detail in milliseconds. _A work in progress._

See the algorithm in action and read more about how it works in [this interactive Observable notebook](https://observablehq.com/@mourner/martin-real-time-rtin-terrain-mesh).

Based on the paper ["Right-Triangulated Irregular Networks" by Will Evans et. al. (1997)](https://www.cs.ubc.ca/~will/papers/rtin.pdf).

![MARTINI terrain demo](martini.gif)

## Example

```js
// set up mesh generator for a certain 2^k+1 grid size
const martini = new Martini(257);

// generate RTIN hierarchy from terrain data (an array of size^2 length)
const tile = martini.createTile(terrain);

// get a mesh (vertices and triangles indices) for a 10m error
const mesh = tile.getMesh(10);
```

## Install

```bash
npm install @mapbox/martini
```
