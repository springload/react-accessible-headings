import React, {
  useContext,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
} from "react";

export const LevelContext = React.createContext(1);

type LevelProps = {
  value?: number;
  children: ReactNode;
};

type ErrorLevel = "production" | "development";

let _errorLevel: ErrorLevel = "production";

export function setErrorLevel(errorLevel: ErrorLevel) {
  _errorLevel = errorLevel;
}

export function Level({ children, value }: LevelProps) {
  const contextLevel = useContext(LevelContext);
  const level = levelRange(value !== undefined ? value : contextLevel + 1);
  return (
    <LevelContext.Provider value={level}>{children}</LevelContext.Provider>
  );
}

type HeadingProps = {
  offset?: number;
} & DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

export function H({ children, offset, ...otherProps }: HeadingProps) {
  const contextLevel = useContext(LevelContext);
  const proposedLevel = contextLevel + (offset !== undefined ? offset : 0);
  const level = levelRange(proposedLevel);
  const Heading = `h${level}`;
  if (!isProd()) setTimeout(checkHeadingLevelsDom, CHECK_AFTER_MS);
  return <Heading {...otherProps}>{children}</Heading>;
}

function levelRange(level: number): number {
  if (level > 0 && level <= MAXIMUM_LEVEL) {
    return level;
  }
  const errorMessage = `Heading level "${level}" is not valid HTML5 which only allows levels 1-${MAXIMUM_LEVEL}`;
  if (!isProd()) {
    throw Error(`${errorMessage}${exceptionOnDev}`);
  }
  return Math.min(Math.max(1, level), MAXIMUM_LEVEL);
}

export function useLevel(): number {
  const contextLevel = useContext(LevelContext);
  if (!isProd()) setTimeout(checkHeadingLevelsDom, CHECK_AFTER_MS);
  return levelRange(contextLevel);
}

function checkHeadingLevelsDom() {
  if (typeof window === "undefined") return; // No need to run during SSR
  checkHeadingLevels(
    Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((elm) =>
      parseFloat(elm.tagName.substring(1))
    )
  );
}

export function checkHeadingLevels(headings: number[]): number[] {
  const badHeadings = getBadHeadings(headings);
  if (badHeadings.length > 0) {
    const errorMessage = `WCAG accessibility issue detected: skipped heading levels ${badHeadings.map(
      (num) => `h${num}`
    )}. See https://www.npmjs.com/package/react-accessible-headings#why`;
    if (!isProd()) {
      throw Error(`${errorMessage}${exceptionOnDev}`);
    }
    console.error(errorMessage);
  }
  return badHeadings;
}

function getBadHeadings(headings: number[]): number[] {
  return headings.filter(
    // multiple H1s are not recommended. See docs.
    (heading): boolean => heading === 1
  ).length >= 2 ||
    headings.some((heading, index, arr): boolean => {
      // detect skipped levels
      const precedingHeading = arr[index - 1];
      if (!precedingHeading) return false;
      return heading > precedingHeading + 1;
    })
    ? headings
    : [];
}

function isProd() {
  return _errorLevel === "production";
}

const exceptionOnDev =
  ". This exception is only thrown in non-production environments.";

const MAXIMUM_LEVEL = 6;

const CHECK_AFTER_MS = 1; // will be clamped to ~5ms
