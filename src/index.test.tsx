import React from "react";
import { render } from "@testing-library/react";

import { H, Level, useLevel } from "./index";

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
});
