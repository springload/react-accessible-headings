# react-accessible-headings

## The Problem

[WCAG WAI says](https://www.w3.org/WAI/tutorials/page-structure/headings/),

> Skipping heading ranks can be confusing and should be avoided where possible: Make sure that a `<h2>` is not followed directly by an `<h4>`, for example.

However developers often hardcode specific heading levels into their components such as `<h1>` or `<h2>`, limiting their flexibility and making it harder to adhere to semantic heading levels.

By using `react-accessible-headings` you can have components with flexible headings that fit the appropriate heading level, allowing you to more easily create accessible headings that don't skip levels.

Could you avoid this library and perhaps make component props that set the heading level, or use `children` in each instance so that the heading level is correct? Sure, but this is an alternative approach that makes it easier to refactor and 'indent' heading levels arbitrarily without having to know the correct heading level numbers. See the <a href="#examples-toc">Examples</a> section for an analysis of the pros and cons of this approach.

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
      </Level>
    </div>
  );
}
```

## Examples <a name="examples-toc"></a>

### The 'Card' Example <a name="examples-card"></a>

Imagine you have a hypothetical 'Card' component that is coded as,

```jsx
export function Card({ children, heading }) {
  return (
    <div className="card">
      <h1 className="card__heading">{heading}</h1>
      {children}
    </div>
  );
}
```

But then you want to make the `<h1>` configurable to make it either an `<h1>` or an `<h2>`. The card will be used in two places with two different heading levels.

So you might refactor the code to support that feature like this,

```jsx
export function Card({ children, heading, headingLevel }) {
  return (
    <div className="card">
      {headingLevel === 1 ? (
        <h1 className="card__heading">{heading}</h1>
      ) : headingLevel === 2 ? (
        <h2 className="card__heading">{heading}</h2>
      ) : null}
      {children}
    </div>
  );
}
```

or,

```jsx
export function Card({ children, heading, headingLevel }) {
  return (
    <div className="card">
      {React.createElement(
        "h" + headingLevel,
        { className: "card__heading" },
        heading
      )}
      {children}
    </div>
  );
}
```

...and now the parent component needs to set the `headingLevel` number, a confusingly indirect way of making an `h1` or `h2`.

Or, perhaps you'd use `children`,

```jsx
export function Card({ children }) {
  return <div className="card">{children}</div>;
}
```

...but now the parent component needs to know about the `"card__heading"` className and the implementation details of `<Card>` are leaking; there's less encapsulation when the usage looks like,

```jsx
// usage
<Card>
  <h1 className="card__heading">text</h1>
  <p>body</p>
</Card>
<Card>
  <h2 className="card__heading">text</h2>
  <p>body</p>
</Card>
```

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

...while the usage looks like,

```jsx
// usage
<Card heading="text">
  <p>body</p>
</Card>
<Level>
  <Card heading="text">
    <p>body</p>
  </Card>
</Level>
```

The `<Level>` indents all the `<H>` heading levels inside the `<Level>`.

And finally (for this example) let's consider another refactoring. If we want to add a new `h1` to the page and lower every other heading it's now easy to add another `<Level>` wrapper to indent everything and you're done. Much easier than updating lots of `h*` numbers around the code to realign them all...

```jsx
<H>Cards</H>
<Level>
  <Card heading="text">
    <p>body</p>
  </Card>
  <Level>
    <Card heading="text">
      <p>body</p>
    </Card>
  </Level>
</Level>
```

So `react-accessible-headings` is an alternative composition technique for page headings that may make it easier to refactor and reuse code. The `<Level>` concept means you only need to think about whether it's a deeper level, without having to know the specific heading level number.

That all said, having a flexible heading level may be more abstract and confusing to some developers. It's an extra thing to learn, even though it is a simple concept. It may not be appropriate for some codebases.

### The 'useLevel query' Example <a name="examples-uselevel"></a>

If you want to programatically query the current level you can,

```jsx
import { useLevel, H } from "react-accessible-headings";

export default function() {
  const level = useLevel(); // level is a number (integer) from 1-6
  return (
    <div className={`heading--${level}`}>
      <H>text</H>
    </div>
  );
}
```

### The 'Offset' Example <a name="examples-offset"></a>

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

## API

All APIs have TypeScript types available.

### `<Level>` component

Props: `value`: _(Optional)_ a **number** to override the level. There are no other props, except `children`.

This component doesn't render anything except `children`, so there's no wrapper element.

In Development mode an exception will be thrown if attempting to set an invalid value such as `7` as HTML only has h1-h6. In Production mode an error will be logged via `console.error`.

### `<H>` component

Props: `offset`: _(Optional)_ a **number** to offset the heading level (see <a href="#examples-offset">_Examples: The 'Offset' Example_</a> for more). All other valid props for an heading are also accepted.

This component renders either `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, or `<h6>`.

In Development mode an exception will be thrown if attempting to render invalid HTML such as `<h7>`. In Production mode an error will be logged via `console.error`, and the value will be clamped from 1-6 (because `<h7>` is invalid HTML and it would be pointless to render that).

### `useLevel` context hook

If for some reason you'd like to inspect the current `level` value then `useLevel()` which will return a **number** (integer) from 1-6. (see <a href="#examples-uselevel">_Examples: The 'useLevel query' Example_</a> for more).

In Development mode an exception will be thrown if `useLevel` resolves to an invalid heading level such as `7`. In Production mode an error will be logged via `console.error`, and the value will be clamped from 1-6 (because `7` is an invalid heading level and it would be pointless to use that).

### `LevelContext` context

The raw React Context. Note that the value may be `undefined` in which case you should infer a level of `1`. No clamping of valid ranges of values occurs.

## Limitations

While this library facilitates dynamic heading levels it doesn't detect skipped heading levels through incorrect usage such as,

```jsx
<h1>Heading 1</h1>
<Level>
  <Level>
    <Level>
      <H>this will be a heading 4. Levels 2 and 3 were skipped!</H>
    </Level>
  </Level>
</Level>
```

Testing in [Axe](https://www.deque.com/axe/) will reveal this error. It's unlikely that this project will introduce a runtime check for analysing heading levels as Axe already does this. Also, because webpages could have a static HTML `h1` with a React app rendering only `h2`s (a perfectly valid and accessible approach) then a test would need to analyse the whole DOM and have nothing to do with React in particular or this project. Replicating this Axe functionality would likely be pointless.

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
