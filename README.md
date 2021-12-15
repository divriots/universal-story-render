# Universal story renderer

This tiny library dynamically discovers the type (UI elements only) of a given JS object using typical frameworks signatures.
It also supports rendering of that object.

## Table of Contents

- [Install](#install)
- [Usage](#usage)

## Install

This project uses [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

```sh
$ npm install --save @divriots/universal-story-render
```

## Usage

```js
// using React jsx
import { typeOf, render } from "@divriots/universal-story-render";
import ReactDOM from "react-dom";

console.log(typeOf(<div />)); // React
render(() => ReactDOM, <div />, "React", div);
```

## Supported component types

| Library          | typeOf value            | dynamic required render library |
| ---------------- | ----------------------- | ------------------------------- |
| React            | `React`                 | `react-dom`                     |
| Preact           | `Preact`                | `preact`                        |
| Stencil          | `Stencil`               | `@stencil/core/internal/client` |
| Omi              | `Omi`                   | `omi`                           |
| Riot             | `Riot`\|`RiotStory`     | `riot`                          |
| Svelte           | `Svelte`\|`SvelteStory` | none                            |
| Vue              | `Vue`                   | `vue`                           |
| Solid            | `Solid`                 | `solid-js/dom`                  |
| Fast             | `ViewTemplate`          | none                            |
| Lit              | `TemplateResult`        | `lit-html`                      |
| LWC              | `Lwc`                   | `lwc`                           |
| uhtml            | `Hole`                  | `uhtml`                         |
| lighterhtml      | `LighterHole`           | `lighterhtml`                   |
| DOM              | `Element`               | none                            |
| DocumentFragment | `DocumentFragment`      | none                            |
| Iterable         | `Iterable`              | none                            |
| Angular          | `Angular`               | `@angular/platform-browser-dynamic`, `@angular/core`, `@angular/platform-browser` |

## Explicit type

If the passed object/function has a String property `_$story_type$`, its value will be used as type (no guessing)

## Custom renderers

On top of framework renderers, this library also support 2 custom renderers (which can be used with above `_$story_type$` property):

### `RenderProp`
```
const obj = {
  render(div) {
    // ...
  }
}
render(null, obj, "RenderProp", div);
```

### `RenderFn`
```
const obj = function render(div) {
  // ...
}
render(null, obj, "RenderFn", div);
```
