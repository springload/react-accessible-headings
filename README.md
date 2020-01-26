# react-accessible-headings

## The Problem

[WCAG WAI says](https://www.w3.org/WAI/tutorials/page-structure/headings/),

> Skipping heading ranks can be confusing and should be avoided where possible: Make sure that a `<h2>` is not followed directly by an `<h4>`, for example.

However developers often hardcode specific heading levels into their components, limiting their flexibility and making it harder to adhere to semantic heading levels.

By using `react-accessible-headings` you can have components with flexible headings that fit the appropriate heading level, allowing you to more easily create accessible headings that don't skip levels.

Could you avoid this library and perhaps make component props that set the heading level, or use `children` in each instance so that the heading level is correct? Sure, but this is an alternative approach that makes it easier to refactor and 'indent' heading levels arbitrarily without having to know the correct heading levels. See the <a href="#examples-toc">Examples</a> section for an indepth analysis about the pros and cons of this approach.

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

## API

All APIs have TypeScript types available.

### `<Level>` component

Props: `value`: _(Optional)_ a **number** to override the level. An exception will be thrown if attempting to set an invalid value such as `7` as HTML only has h1-h6. There are no other props, except `children`.

This component doesn't render any HTML except `children`.

### `<H>` component

Props: `offset`: _(Optional)_ a **number** to offset the heading level (see <a href="#examples-offset">_Examples: The 'Offset' Example_</a> for more). All other valid props for an heading are also accepted.

This component renders either `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, or `<h6>`. An exception will be thrown if attempting to render invalid HTML such as `<h7>`.

### `useLevel`

If for some reason you'd like to inspect the current `level` value then `useLevel()` which will return a **number** (integer) from 1-6. (see <a href="#examples-uselevel">_Examples: The 'useLevel query' Example_</a> for more). An exception will be thrown if useLevel resolves to an invalid heading level.

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

Testing in [Axe](https://www.deque.com/axe/) will reveal this error. It's unlikely that this project will introduce a runtime check for analysing heading levels as Axe already does this. Also, because webpages could have a static HTML `h1` with a React app rendering only `h2`s (a perfectly valid and accessible approach) then any check would need to analyse the whole DOM and have nothing to do with React or this project, so if a run-time check was added this would be a separate project, but replicating this Axe functionality would probably be pointless.

## Further reading

### Prior art

[DocBook](https://docbook.org/), the ill-fated [XHTML 2](https://www.w3.org/TR/xhtml2/mod-structural.html#sec_8.5.), and [HTML5's abandoned 'outline'](http://blog.paciellogroup.com/2013/10/html5-document-outline/) had a very similar idea. Also check out the 2014 project [html5-h](https://github.com/ThePacielloGroup/html5-h).

### References

#### [WCAG 2: G141: Organizing a page using headings](https://www.w3.org/TR/2012/NOTE-WCAG20-TECHS-20120103/G141),

> To facilitate navigation and understanding of overall document structure, authors should use headings that are properly nested (e.g., h1 followed by h2, h2 followed by h2 or h3, h3 followed by h3 or h4, etc.).

#### [Axe: Heading levels should only increase by one](https://dequeuniversity.com/rules/axe/3.4/heading-order)

> Ensure headings are in a logical order. For example, check that all headings are marked with `h1` through `h6` elements and that these are ordered hierarchically. For example, the heading level following an `h1` element should be an `h2` element, not an `h3` element.

## Examples <a name="examples-toc"></a>

### The 'Card' Example <a name="examples-card"></a>

Consider a 'card' component that might be coded as,

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

But then you want to reuse that card in two places with two different heading levels, so you might refactor the code like,

```jsx
export function Card({ children, heading, headingLevel }) {
  return (
    <div className="card">
      {headingLevel === 2 ? (
        <h2 className="card__heading">{heading}</h2>
      ) : headingLevel === 3 ? (
        <h3 className="card__heading">{heading}</h3>
      ) : null}
      {children}
    </div>
  );
}
```

or

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

and now the parent component needs to know the `headingLevel` number, so it's an abstract way of making an `h2` or `h3`

Or, perhaps you'd use `children`,

```jsx
export function Card({ children }) {
  return <div className="card">{children}</div>;
}
```

but now the parent component needs to know about the `"card__heading"` class and the implementation details of `<Card>` are leaking; there's less encapsulation...

```jsx
// usage
<h1>Cards</h1>
<Card>
  <h2 className="card__heading">text</h2>
  <p>body</p>
</Card>
<h2>See also</h2>
<Card>
  <h3 className="card__heading">text</h3>
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

// usage
<H>Cards</H>
<Level>
  <Card heading="text">
    <p>body</p>
  </Card>
  <H>See also</H>
  <Level>
    <Card heading="text">
      <p>body</p>
    </Card>
  </Level>
</Level>
```

And then imagine that there's an <abbr title="information architecture">IA</abbr> change that lowers the heading level of all of these because there's a new `h1` in the page. It's now easy to add a `<Level>` wrapper to indent everything and you're done. Much easier than updating lots of `h*` numbers around the code to realign them all...

```jsx
<Level>
  <H>Cards</H>
  <Level>
    <Card heading="text">
      <p>body</p>
    </Card>
    <H>See also</H>
    <Level>
      <Card heading="text">
        <p>body</p>
      </Card>
    </Level>
  </Level>
</Level>
```

So it's an alternative composition technique for page headings that may make it easier to refactor and reuse code. The `<Level>` concept means you only need to think about whether it's a deeper level, without having to know the specific heading level number.

That all said, having a flexible heading level may be more abstract and confusing to some developers. It's an extra thing to learn, even though it is a simple concept. It may not be appropriate for some codebases.

### The 'useLevel query' Example <a name="examples-uselevel"></a>

If you want to programatically query the current level you can,

```jsx
import { useLevel, H } from "react-accessible-headings";

const level = useLevel(); // level is a number (integer) from 1-6

return (
  <div className={`heading--${level}`}>
    <H>text</H>
  </div>
);
```

### The 'Offset' Example <a name="examples-offset"></a>

If you want to have heading levels dynamic yet related to one another you can provide an `offset` prop.

```jsx
<div className="card">
  <H className="card__heading">This will be the current heading level</H>
  <H offset={1} className="card__sub-heading">
    This will be one level deeper
  </H>
  <H offset={2} className="card__sub-sub-heading">
    This will be two levels deeper. I don't know why you'd want this!
  </H>
  {children}
</div>
```
