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
| DOM              | `Element`               | none                            |
| DocumentFragment | `DocumentFragment`      | none                            |
| Iterable         | `Iterable`              | none                            |
| Angular          | `Angular`               | `tslib`, `@angular/platform-browser-dynamic`, `@angular/core`, `@angular/platform-browser` |
