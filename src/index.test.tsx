import React from "react";
import { render } from "@testing-library/react";

import { checkHeadingLevels, H, Level, useLevel } from "./index";

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

test("Level throws in non-production mode if level is > 6", () => {
  expect(() => render(<Level value={7}>{""}</Level>)).toThrow();
});

test("Valid heading levels are ignored (dev mode)", () => {
  const goodHeadings = [1, 2, 3, 2];
  expect(() => checkHeadingLevels(goodHeadings)).not.toThrow();
  const goodHeadings2 = [2, 3, 2, 1, 2, 3, 2];
  expect(() => checkHeadingLevels(goodHeadings2)).not.toThrow();
  const goodHeadings3 = [1, 2, 3, 2];
  expect(() => checkHeadingLevels(goodHeadings3)).not.toThrow();
});

test("Invalid skipped headings are detected (dev mode)", () => {
  const skippedHeadings = [1, 2, 4, 2];
  expect(() => checkHeadingLevels(skippedHeadings)).toThrow();
});

test("Multiple h1s are detected (dev mode)", () => {
  const multipleH1s = [1, 2, 3, 1];
  expect(() => checkHeadingLevels(multipleH1s)).toThrow();
});

describe("in production mode", () => {
  let oldEnv;

  beforeEach(() => {
    oldEnv = process.env;
    process.env = { ...oldEnv, NODE_ENV: "production" };
  });

  afterEach(() => {
    process.env = oldEnv;
  });

  test("Level does not throw in production mode if level is > 6", () => {
    render(<Level value={7}>{""}</Level>);
  });

  test("H is clamped to a valid range", () => {
    const { getByText } = render(
      <Level value={7}>
        <H>Foo</H>
      </Level>
    );
    const headingEl = getByText("Foo");

    expect(headingEl.tagName).toBe("H6");
  });

  test("H is clamped to a valid range in another case", () => {
    const { getByText } = render(
      <Level value={6}>
        <H offset={1}>Foo</H>
      </Level>
    );
    const headingEl = getByText("Foo");

    expect(headingEl.tagName).toBe("H6");
  });

  test("useLevel returns the correct heading level", () => {
    function Test() {
      const level = useLevel();

      expect(level).toBe(3);

      return null;
    }

    render(
      <Level value={3}>
        <Test />
      </Level>
    );
  });

  test("Valid heading levels are ignored (prod mode)", () => {
    const goodHeadings = [1, 2, 3, 2];
    expect(checkHeadingLevels(goodHeadings).length).toBe(0);
    const goodHeadings2 = [2, 3, 2, 1, 2, 3, 2];
    expect(checkHeadingLevels(goodHeadings2).length).toBe(0);
    const goodHeadings3 = [1, 2, 3, 2];
    expect(checkHeadingLevels(goodHeadings3).length).toBe(0);
  });

  test("Invalid skipped headings are detected (prod mode)", () => {
    const skippedHeadings = [1, 2, 4, 2];
    expect(checkHeadingLevels(skippedHeadings).length).toBe(
      skippedHeadings.length
    );
  });

  test("Multiple h1s are detected (prod mode)", () => {
    const multipleH1s = [1, 2, 3, 1];
    expect(checkHeadingLevels(multipleH1s).length).toBe(multipleH1s.length);
  });
});
