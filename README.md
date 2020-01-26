# react-accessible-headings

## The Problem

[WCAG WAI says](https://www.w3.org/WAI/tutorials/page-structure/headings/),

> skipping heading ranks can be confusing and should be avoided where possible: Make sure that a `<h2>` is not followed directly by an `<h4>`, for example.

However developers often hardcode specific heading levels into their components, limiting their flexibility.

By using `react-accessible-headings` you can have components with dynamic headings that fit the appropriate heading level, allowing you to more easily create accessible headings that don't skip levels.

This library is less than 1 kilobyte (minified and compressed).

## Usage

```jsx
import React from "react";
import { Level, H } from "react-accessible-headings";

export default function() {
  return (
    <div>
      <H>This will be a heading 1</H>
      <Level>
        <H>and this a Heading 2</H>
        <H>another Heading 2</H>
        <Level>
          <H>a Heading 3</H>
        </Level>
        <H>yet another Heading 2</H>
      </Level>
    </div>
  );
}
```

### Usage with `offset`

```jsx
import React from "react";
import { Level, H } from "react-accessible-headings";

export default function() {
  return (
    <div>
      <H>This will be a heading 1</H>
      <Level>
        <H>This will be a heading 2</H>
        <H offset={1}>This will be a heading 3</H>
      </Level>
    </div>
  );
}
```

## Exports

TypeScript is available.

### `Level` component

Props: `depth`: _(Optional)_ a **number** to override the level. There are no other props.

This component doesn't render any HTML except `children`.

### `H` component

Props: `offset`: _(Optional)_ a **number** to offset the heading level. All other valid props for an heading are also accepted.

This component renders either `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, or `<h6>`. An exception will be thrown if attempting to render invalid HTML such as `<h7>` or greater.

### `LevelContext` context

If for some reason you'd like to inspect the current `level` value then `useContext(LevelContext)`.

## Limitations

While this library facilitates dynamic heading levels it doesn't detect skipped heading levels through incorrect usage such as,

```jsx
<Level>
  <Level>
    <H>this will be a heading 3</H>
  </Level>
</Level>
```

or,

```jsx
<H offset={2}>this will be a heading 3</H>
```

or,

```jsx
<Level depth={3}>
  <H>this will be a heading 3</H>
</Level>
```

If that `h3` wasn't preceded by `h1` and `h2` then that's an accessibility problem. Testing in [Axe](https://www.deque.com/axe/) will reveal this..

It's unlikely that we will introduce a runtime check for heading levels as Axe already does this. Because webpages could have a static HTML `h1` with React apps rendering `h2`s then any check would have to analyse the whole DOM and have nothing to do with React or this component, so if it was written it would be a separate standalone package, but replicating Axe functionality would probably be pointless.

## Further reading

### Prior art

[DocBook](https://docbook.org/), the ill-fated [XHTML 2](https://www.w3.org/TR/xhtml2/mod-structural.html#sec_8.5.), and [HTML5's abandoned 'outline'](http://blog.paciellogroup.com/2013/10/html5-document-outline/) had a similar idea. Also check out the 2014 project [html5-h](https://github.com/ThePacielloGroup/html5-h).

### References

#### [WCAG 2: G141: Organizing a page using headings](https://www.w3.org/TR/2012/NOTE-WCAG20-TECHS-20120103/G141),

> To facilitate navigation and understanding of overall document structure, authors should use headings that are properly nested (e.g., h1 followed by h2, h2 followed by h2 or h3, h3 followed by h3 or h4, etc.).

#### [Axe: Heading levels should only increase by one](https://dequeuniversity.com/rules/axe/3.4/heading-order)

> Ensure headings are in a logical order. For example, check that all headings are marked with `h1` through `h6` elements and that these are ordered hierarchically. For example, the heading level following an `h1` element should be an `h2` element, not an `h3` element.
