import React from "react";
import { render } from "@testing-library/react";

import { checkHeadingLevels, H, Level, useHClassName, useLevel } from "./index";

test("H renders an H1 be default", () => {
  const { getByText } = render(<H>Foo</H>);
  const headingEl = getByText("Foo");

  expect(headingEl.tagName).toBe("H1");
});

test("H respects the offset prop", () => {
  const { getByText } = render(<H offset={1}>Foo</H>);
  const headingEl = getByText("Foo");

  expect(headingEl.tagName).toBe("H2");
});

test("Level increments the level rendered by H", () => {
  const { getByText } = render(
    <Level>
      <H>Foo</H>
    </Level>
  );
  const headingEl = getByText("Foo");

  expect(headingEl.tagName).toBe("H2");
});

test("Level allows overriding the level", () => {
  const { getByText } = render(
    <Level value={3}>
      <H>Foo</H>
    </Level>
  );
  const headingEl = getByText("Foo");

  expect(headingEl.tagName).toBe("H3");
});

test("Error if level is > 6", () => {
  const consoleMock = jest.spyOn(console, "error").mockImplementation();
  expect(consoleMock).not.toBeCalled();
  render(<Level value={7}>{""}</Level>);
  expect(consoleMock).toBeCalled();
  consoleMock.mockRestore();
});

test("Valid heading levels are ignored", () => {
  const consoleMock = jest.spyOn(console, "error").mockImplementation();
  const goodHeadings = [1, 2, 3, 2];
  expect(consoleMock).not.toBeCalled();
  checkHeadingLevels(goodHeadings);
  expect(consoleMock).not.toBeCalled();
  consoleMock.mockRestore();
});

test("Valid heading levels are ignored", () => {
  const consoleMock = jest.spyOn(console, "error").mockImplementation();
  const goodHeadings2 = [2, 3, 2, 1, 2, 3, 2];
  expect(consoleMock).not.toBeCalled();
  checkHeadingLevels(goodHeadings2);
  expect(consoleMock).not.toBeCalled();
  consoleMock.mockRestore();
});

test("Valid heading levels are ignored", () => {
  const consoleMock = jest.spyOn(console, "error").mockImplementation();
  const goodHeadings3 = [1, 2, 3, 2];
  expect(consoleMock).not.toBeCalled();
  checkHeadingLevels(goodHeadings3);
  expect(consoleMock).not.toBeCalled();
  consoleMock.mockRestore();
});

test("Invalid skipped headings are detected", () => {
  const consoleMock = jest.spyOn(console, "error").mockImplementation();
  const skippedHeadings = [1, 2, 4, 2];
  expect(consoleMock).not.toBeCalled();
  checkHeadingLevels(skippedHeadings);
  expect(consoleMock).toBeCalled();
  consoleMock.mockRestore();
});

test("Multiple h1s are detected", () => {
  const consoleMock = jest.spyOn(console, "error").mockImplementation();
  const multipleH1s = [1, 2, 3, 1];
  expect(consoleMock).not.toBeCalled();
  checkHeadingLevels(multipleH1s);
  expect(consoleMock).toBeCalled();
  consoleMock.mockRestore();
});

test("hClassName sets className on every decendant H elements", () => {
  const { getAllByText } = render(
    <Level hClassName="h">
      <H>Foo</H>
      <H>Foo</H>
      <Level>
        <H>Foo</H>
      </Level>
    </Level>
  );

  const hClassNames = getAllByText("Foo").map((el) => el.className);
  expect(hClassNames).toEqual(["h", "h", "h"]);
});

test("H elements can have className", () => {
  const { getByText } = render(
    <Level>
      <H className="foo">Bar</H>
    </Level>
  );

  const headingEl = getByText("Bar");
  expect(headingEl.className).toBe("foo");
});

test("H element's className does not override hClassName", () => {
  const { getByText } = render(
    <Level hClassName="foo">
      <H className="bar">Baz</H>
    </Level>
  );

  const headingEl = getByText("Baz");
  expect(headingEl.className).toBe("foo bar");
});

test("Child's hClassName overrides the parent", () => {
  const { getByText } = render(
    <Level hClassName="foo">
      <Level hClassName="bar">
        <H>Baz</H>
      </Level>
    </Level>
  );

  const headingEl = getByText("Baz");
  expect(headingEl.className).toBe("bar");
});

test("useHClassName returns the correct className", () => {
  function Test() {
    const className = useHClassName();
    expect(className).toBe("foo");
    return null;
  }

  render(
    <Level hClassName="foo">
      <Test />
    </Level>
  );
});
