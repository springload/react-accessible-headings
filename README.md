# react-accessible-headings

## Why?

In order to make accessible web pages the [W3C: WCAG, WAI say](https://www.w3.org/WAI/tutorials/page-structure/headings/),

> Skipping heading ranks can be confusing and should be avoided where possible: Make sure that a `<h2>` is not followed directly by an `<h4>`, for example.

So an accessible app **must** not have heading levels like this...

- H1
  - H6
- H3
  - H1 (there should only be a single H1!)
  - H5
    - H4
    - H4
- H1

Instead they should look like,

- H1
  - H2
    - H3
    - H3
  - H2
    - H3
      - H4
      - H4
  - H2

## Why a React library?

However as developers of React components it's hard to make components match this semantic hierarchy. We typically hardcode heading levels, like an `<h2>`, or an `<h3>`, into a component. This would limit its flexibility and make it harder to adhere to W3C WCAG.

By using `react-accessible-headings` you can have components with **flexible headings that fit the appropriate heading level**, allowing you to more easily create accessible components, with headings that don't skip levels.

Could you instead write components that accept `props` to set a heading level? Sure. But that requires manual maintenance of the hierarchy. Indenting becomes harder, and it's easier to make mistakes.

This library is 1 kilobyte (minified and compressed).

## Usage

```jsx
import React from 'react';
import { Level, H } from 'react-accessible-headings';

export default function () {
  return (
    <div>
      <H>This will be a heading 1</H>
      <Level>
        <H>and this a Heading 2</H>
      </Level>
    </div>
  );
}
```

### Detecting skipped headings

`react-accessible-headings` tries to encourage correct heading levels by polling the DOM for accessibility errors and printing errors to `console.error`. These errors are page-wide and not necessarily specific to `react-accessible-headings`.

There are two types of errors that are checked

1. Whether there are skipped heading levels. Ie, `<h1>` followed by an `<h3>`;
2. Whether there are multiple `<h1>`s in the page (there should only be a single `<h1>`).

A `console.error()` will be printed if an error occurs.

Testing in [Axe](https://www.deque.com/axe/) will also reveal this type of error.

The reason this was implemented by polling the DOM, rather than analysing the React VDOM (or something), is because only the real DOM knows the actual heading levels that screen readers will use for accessibility reasons. Pages could include headings outside of React apps that affect the heading level, so this library needs to poll the DOM.

## API

All APIs have TypeScript types available.

### `<H>` component

This component renders either `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, or `<h6>` based on how many `<Level>`s were above it.

`react-accessible-headings` tries to help you maintain valid heading hierarchies, so it considers it an application bug to render an `<h7>` (the HTML spec only has 6 heading levels). This might happen if you have too many `<Level>`s above it.

To help debug the error a message will printed via `console.error` if attempting to render invalid levels such as `h7`. To resolve this error fix the wrongly nested `<Level>` elements above it.

All valid props / attributes for an HTML heading are also accepted.

Props: `offset`: _(Optional)_ this optional prop will override the default behaviour. The default behaviour is when you use `<H>` without this prop it will render the current heading level depth. If instead you want to render the `<H>` with a different `offset` (number) then provide this prop.

See <a href="#examples-offset">_Examples: The 'Offset' Example_</a> for more.

### `<Level>` component

Sets a new heading level depth, by incrementing the current heading level for all children using the `<H>` component, or the `useLevel` hook.

This component doesn't render anything except `children`, so there's no wrapper element.

Props: `value`: _(Optional)_ this optional prop will override the default behaviour. The default behaviour is when you use `<Level>` without this prop it will increment the heading level by `1`. If you want to increment by a different `value` (number) that is not `1` then provide this `value` prop. You probably shouldn't be using this.
Props: `hClassName`: _(Optional)_ this optional prop will set a className on all descendant `<H>`s.

An error will be logged via `console.error` if attempting to set an invalid value such as `7`, because HTML only has h1-h6.

### `useLevel` context hook

If you'd like to inspect the current `level` context value then `useLevel()` which will return a **number** (integer) from 1-6. (see <a href="#examples-uselevel">_Examples: The 'useLevel query' Example_</a> for more).

An error will be logged via `console.error` if `useLevel` resolves to an invalid heading level such as `7` and the value will be clamped from 1-6 (because `7` is an invalid heading level and it would be pointless to use that).

### `useHClassName` context hook

If for some reason you'd like to inspect the current `hClassName` value, then `useHClassName()` which will return a **string** representing the className of the Heading elements in the current tree (see <a href="#examples-usehclassname">_Examples: The 'useHClassName' Example_</a> for more).

### `LevelContext` context

Provides direct access to the React Context which is an object with type `undefined | { level: number, hClassName?: string }`. Note that the value may be `undefined` in which case you should infer a `level` of `1`. No clamping of valid ranges of values occurs through this direct accesss.

## Further reading

### Prior art

[DocBook](https://docbook.org/), the ill-fated [XHTML 2](https://www.w3.org/TR/xhtml2/mod-structural.html#sec_8.5.), and [HTML5's abandoned 'outline'](http://blog.paciellogroup.com/2013/10/html5-document-outline/) had a very similar idea. Also check out the 2014 project [html5-h](https://github.com/ThePacielloGroup/html5-h).

### References

#### [WCAG 2: G141: Organizing a page using headings](https://www.w3.org/TR/2012/NOTE-WCAG20-TECHS-20120103/G141),

> To facilitate navigation and understanding of overall document structure, authors should use headings that are properly nested (e.g., h1 followed by h2, h2 followed by h2 or h3, h3 followed by h3 or h4, etc.).

#### [Axe: Heading levels should only increase by one](https://dequeuniversity.com/rules/axe/3.4/heading-order)

> Ensure headings are in a logical order. For example, check that all headings are marked with `h1` through `h6` elements and that these are ordered hierarchically. For example, the heading level following an `h1` element should be an `h2` element, not an `h3` element.

##### [Axe: Page must contain a level-one heading](https://dequeuniversity.com/rules/axe/3.0/page-has-heading-one)

> Generally, it is a best practice to ensure that the beginning of a page's main content starts with a h1 element, and also to ensure that the page contains only one h1 element.

## Justifications <a id="examples-toc" href="#examples-toc">#</a>

Is this library necessary? Could you avoid this library and perhaps make component `props` that set the heading level, or use `children` to set the heading? Sure, that works, but (arguably) that manual approach becomes a maintenance problem across a larger app. Across a whole app this alternative approach is easier to refactor and 'indent' heading levels arbitrarily without having to synchronise the correct heading level numbers across components.

### The 'Card' Example <a id="examples-card" href="#examples-card">#</a>

Imagine you have a hypothetical 'Card' component that is coded as,

```jsx
export function Card({ children, heading }) {
  return (
    <div className="card">
      <h3 className="card__heading">{heading}</h3>
      {children}
    </div>
  );
}
```

But then you want to make the `<h3>` configurable to make it either an `<h2>`, `<h3>`, or `<h4>`.

You might refactor the code to support that feature like this,

```jsx
export function Card({ children, heading, headingLevel }) {
  return (
    <div className="card">
      {headingLevel === 2 ? (
        <h2 className="card__heading">{heading}</h2>
      ) : headingLevel === 3 ? (
        <h3 className="card__heading">{heading}</h3>
      ) : headingLevel === 4 ? (
        <h4 className="card__heading">{heading}</h4>
      ) : null}
      {children}
    </div>
  );
}
```

or more concisely,

```jsx
export function Card({ children, heading, headingLevel }) {
  const Heading = `H${headingLevel}`;
  return (
    <div className="card">
      <Heading className="card__heading">{heading}</Heading>
      {children}
    </div>
  );
}
```

...which is a confusingly indirect way of making a heading level, and it creates a maintenance burden on developers to know the correct level depth of a heading.

Alternatively, with `react-accessible-headings` the implementation details of `<Card>` can stay encapsulated and look like,

```jsx
export function Card({ children, heading }) {
  return (
    <div className="card">
      <H className="card__heading">{heading}</H>
      {children}
    </div>
  );
}
```

And finally (for this example) let's consider another refactoring. If we want to add a new `h2` to the page and lower every other heading it's now easy to add another `<Level>` wrapper to indent everything and you're done. Much easier than updating lots of `h*` numbers around the code to realign them all...

```jsx
<H>Cards</H>
<Level>
  <Card heading="my title">
    <p>body</p>
  </Card>
  <Level>
    <Card heading="my title2">
      <p>body</p>
    </Card>
  </Level>
</Level>
```

So `react-accessible-headings` is an alternative composition technique for page headings that may make it easier to refactor and reuse code. The `<Level>` concept means you only need to think about whether it's a deeper level, without having to know the specific heading level number.

That all said, having a flexible heading level may be more abstract and confusing to some developers. It's an extra thing to learn, even though it is a simple concept. It may not be appropriate for some codebases.

### The 'useLevel query' Example <a id="examples-uselevel" href="#examples-uselevel">#</a>

If you want to programatically query the current level you can,

```jsx
import { useLevel, H } from 'react-accessible-headings';

export default function () {
  const level = useLevel(); // level is a number (integer) from 1-6
  return (
    <div className={`heading--${level}`}>
      <H>text</H>
    </div>
  );
}
```

### The 'Offset' Example <a id="examples-offset" href="#examples-offset">#</a>

If you want to have heading levels relative to the current level you can provide an `offset` prop,

```jsx
<div className="card">
  <H className="card__heading">This will be the current heading level</H>
  <H offset={1} className="card__sub-heading">
    This will be one level deeper
  </H>
  {children}
</div>
```

which is a more concise way of writing this,

```jsx
<div className="card">
  <H className="card__heading">This will be the current heading level</H>
  <Level>
    <H className="card__sub-heading">This will be one level deeper</H>
  </Level>
  {children}
</div>
```

However `<Level>` will establish a new deeper _heading level_ context whereas `offset` will not.

### The 'hClassName' Example <a id="examples-hclassname" href="#examples-hclassname">#</a>

If you ever need to style multiple headings with css, you might find that your highly composable React code (for a good reason)
hides the heading selectors from you:

```css
.card h{???} {
  margin-top: 2em;
}
```

In this case you can set `className` on every `<H>` element and use the class selector in CSS, or as a shorthand you can provide `hClassName` prop to a `<Level>` element, which will set your className on every decendant heading element in the sub-tree:

```jsx
<Level hClassName="heading">
  <H>My ClassName is `heading`</H>
  <H className="custom">My ClassName is `heading custom`</H>
  <Level>
    <H>My ClassName is also `heading`</H>
    <Level hClassName="card-heading">
      <H>Mine changed to `card-heading`</H>
    </Level>
  </Level>
</Level>
```

### The 'useHClassName' Example <a id="examples-usehclassname" href="#examples-usehclassname">#</a>

This example shows how you can utilize `useHClassName` to extend `hClassName` instead of overriding it.

```jsx
import { useHClassName, Level } from 'react-accessible-headings';

function Nested() {
  const hClassName = useHClassName(); // className declared by parent <Level>

  return <Level hClassName={hClassName + '__with-bem-syntax'}>...</Level>;
}

<Level hClassName="heading">
  <Nested />
</Level>;
// hClassName changed to "heading__with-bem-syntax"
```
