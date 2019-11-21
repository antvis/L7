# inversify-inject-decorators

[![Join the chat at https://gitter.im/inversify/InversifyJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/inversify/InversifyJS?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://secure.travis-ci.org/inversify/inversify-inject-decorators.svg?branch=master)](https://travis-ci.org/inversify/inversify-inject-decorators)
[![Test Coverage](https://codeclimate.com/github/inversify/inversify-inject-decorators/badges/coverage.svg)](https://codeclimate.com/github/inversify/inversify-inject-decorators/coverage)
[![npm version](https://badge.fury.io/js/inversify-inject-decorators.svg)](http://badge.fury.io/js/inversify-inject-decorators)
[![Dependencies](https://david-dm.org/inversify/inversify-inject-decorators.svg)](https://david-dm.org/inversify/inversify-inject-decorators#info=dependencies)
[![img](https://david-dm.org/inversify/inversify-inject-decorators/dev-status.svg)](https://david-dm.org/inversify/inversify-inject-decorators/#info=devDependencies)
[![img](https://david-dm.org/inversify/inversify-inject-decorators/peer-status.svg)](https://david-dm.org/inversify/inversify-inject-decorators/#info=peerDependenciess)
[![Known Vulnerabilities](https://snyk.io/test/github/inversify/inversify-inject-decorators/badge.svg)](https://snyk.io/test/github/inversify/inversify-inject-decorators)

[![NPM](https://nodei.co/npm/inversify-inject-decorators.png?downloads=true&downloadRank=true)](https://nodei.co/npm/inversify-inject-decorators/)
[![NPM](https://nodei.co/npm-dl/inversify-inject-decorators.png?months=9&height=3)](https://nodei.co/npm/inversify-inject-decorators/)

Lazy evaluated property injection decorators.

## Motivation
Some frameworks and libraries take control over the creation of instances 
of a given class. For example, React takes control over the creation of 
instances of a given React component. This kind of frameworks and libraries 
**prevent us from being able to use constructor injection** and as a result 
they are not easy to integrate with InversifyJS.

InversifyJS also provides support for property injection but it also
requires the instances of a class to be created by InversifyJS.

The decorators included in this library will allow you to lazy-inject 
properties even when the instances of a class cannot created by InversifyJS.

This library allows you to integrate InversifyJS with any library or 
framework that takes control over the creation of instances of a 
given class.

## Installation
You can install `inversify-inject-decorators` using npm:

```
$ npm install inversify inversify-inject-decorators reflect-metadata --save
```

The `inversify-inject-decorators` type definitions are included in the npm module and require TypeScript 2.0.

> :warning: Please note that this library requires support for the ES6 Symbol. You can use the [es6-symbol polyfill](https://www.npmjs.com/package/es6-symbol) as a work arround.

Please refer to the [InversifyJS documentation](https://github.com/inversify/InversifyJS#installation) to learn more about the installation process.

## Caching vs Non Caching Behaviour

By default, the lazy injection mechanism implemented by this will cache all requests to the underlying container.
This means that rebinding or unbinding services to/from service identifiers will not be reflected in the instances into which these services have been injected into. The same holds true for scenarios where you dynamically load/unload container modules and thus either add or remove bindings from your container.

To overcome this limitation, one can now pass an additional boolean parameter to `getDecorators(container: Container, doCache = true)`. When set to `false`, services resolved from the container will no longer be cached and will always be resolved from the container directly, e.g.

```ts
import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";

const container: Container = new Container();
const { lazyInject } = getDecorators(container, false);
```

## Basic property lazy-injection with `@lazyInject`
The following example showcases how to inject into a property 
using the `@lazyInject` decorator:

```ts
import getDecorators from "inversify-inject-decorators";
import { Container, injectable, tagged, named } from "inversify";

let container = new Container();
let { lazyInject } = getDecorators(container);
let TYPES = { Weapon: "Weapon" };

interface Weapon {
    name: string;
    durability: number;
    use(): void;
}

@injectable()
class Sword implements Weapon {
    public name: string;
    public durability: number;
    public constructor() {
        this.durability = 100;
        this.name = "Sword";
    }
    public use() {
        this.durability = this.durability - 10;
    }
}

class Warrior {
    @lazyInject(TYPES.Weapon)
    public weapon: Weapon;
}

container.bind<Weapon>(TYPES.Weapon).to(Sword);

let warrior = new Warrior();
console.log(warrior.weapon instanceof Sword); // true
```

## Named property injection with `@lazyInjectNamed`
The following example showcases how to inject into a named property 
using the `@lazyInjectNamed` decorator:

```ts
import getDecorators from "inversify-inject-decorators";
import { Container, injectable, named } from "inversify";

let container = new Container();
let { lazyInjectNamed } = getDecorators(container);
let TYPES = { Weapon: "Weapon" };

interface Weapon {
    name: string;
    durability: number;
    use(): void;
}

@injectable()
class Sword implements Weapon {
    public name: string;
    public durability: number;
    public constructor() {
        this.durability = 100;
        this.name = "Sword";
    }
    public use() {
        this.durability = this.durability - 10;
    }
}

@injectable()
class Shuriken implements Weapon {
    public name: string;
    public durability: number;
    public constructor() {
        this.durability = 100;
        this.name = "Shuriken";
    }
    public use() {
        this.durability = this.durability - 10;
    }
}

class Warrior {

    @lazyInjectNamed(TYPES.Weapon, "not-throwwable")
    @named("not-throwwable")
    public primaryWeapon: Weapon;

    @lazyInjectNamed(TYPES.Weapon, "throwwable")
    @named("throwwable")
    public secondaryWeapon: Weapon;

}

container.bind<Weapon>(TYPES.Weapon).to(Sword).whenTargetNamed("not-throwwable");
container.bind<Weapon>(TYPES.Weapon).to(Shuriken).whenTargetNamed("throwwable");

let warrior = new Warrior();
console.log(warrior.primaryWeapon instanceof Sword); // true
console.log(warrior.primaryWeapon instanceof Shuriken); // true
```

## Tagged property injection with `@lazyInjectTagged`
The following example showcases how to inject a tagged property 
using the `@lazyInjectTagged` decorator:

```ts
import getDecorators from "inversify-inject-decorators";
import { Container, injectable, tagged } from "inversify";

let container = new Container();
let { lazyInjectTagged } = getDecorators(container);
let TYPES = { Weapon: "Weapon" };

interface Weapon {
    name: string;
    durability: number;
    use(): void;
}

@injectable()
class Sword implements Weapon {
    public name: string;
    public durability: number;
    public constructor() {
        this.durability = 100;
        this.name = "Sword";
    }
    public use() {
        this.durability = this.durability - 10;
    }
}

@injectable()
class Shuriken implements Weapon {
    public name: string;
    public durability: number;
    public constructor() {
        this.durability = 100;
        this.name = "Shuriken";
    }
    public use() {
        this.durability = this.durability - 10;
    }
}

class Warrior {

    @lazyInjectTagged(TYPES.Weapon, "throwwable", false)
    @tagged("throwwable", false)
    public primaryWeapon: Weapon;

    @lazyInjectTagged(TYPES.Weapon, "throwwable", true)
    @tagged("throwwable", true)
    public secondaryWeapon: Weapon;

}

container.bind<Weapon>(TYPES.Weapon).to(Sword).whenTargetTagged("throwwable", false);
container.bind<Weapon>(TYPES.Weapon).to(Shuriken).whenTargetTagged("throwwable", true);

let warrior = new Warrior();
console.log(warrior.primaryWeapon instanceof Sword); // true
console.log(warrior.primaryWeapon instanceof Shuriken); // true
```

## Multi-injection into a property with `@lazyMultiInject`
The following example showcases how to multi-inject a property 
using the `@lazyMultiInject` decorator:

```ts
import getDecorators from "inversify-inject-decorators";
import { Container, injectable } from "inversify";

let container = new Container();
let { lazyMultiInject } = getDecorators(container);
let TYPES = { Weapon: "Weapon" };

interface Weapon {
    name: string;
    durability: number;
    use(): void;
}

@injectable()
class Sword implements Weapon {
    public name: string;
    public durability: number;
    public constructor() {
        this.durability = 100;
        this.name = "Sword";
    }
    public use() {
        this.durability = this.durability - 10;
    }
}

@injectable()
class Shuriken implements Weapon {
    public name: string;
    public durability: number;
    public constructor() {
        this.durability = 100;
        this.name = "Shuriken";
    }
    public use() {
        this.durability = this.durability - 10;
    }
}

class Warrior {

    @lazyMultiInject(TYPES.Weapon)
    public weapons: Weapon[];

}

container.bind<Weapon>(TYPES.Weapon).to(Sword);
container.bind<Weapon>(TYPES.Weapon).to(Shuriken);

let warrior = new Warrior();
console.log(warrior.weapons[0] instanceof Sword); // true
console.log(warrior.weapons[1] instanceof Shuriken); // true
```
