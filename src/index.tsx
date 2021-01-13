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
  if (!isProd()) setTimeout(checkHeadingLevels, CHECK_AFTER_MS);
  return <Heading {...otherProps}>{children}</Heading>;
}

function levelRange(level: number): number {
  if (level > 0 && level <= MAXIMUM_LEVEL) {
    return level;
  }
  const errorMessage = `Heading level "${level}" is not valid HTML5 which only allows levels 1-${MAXIMUM_LEVEL}${exceptionOnDev}`;
  if (!isProd()) {
    throw Error(errorMessage);
  }
  console.error(errorMessage);
  // clamp values
  if (level > MAXIMUM_LEVEL) {
    return MAXIMUM_LEVEL;
  } else if (level < 1) {
    return 1;
  }
}

export function useLevel(): number {
  const contextLevel = useContext(LevelContext);
  if (!isProd()) setTimeout(checkHeadingLevels, CHECK_AFTER_MS);
  return levelRange(contextLevel);
}

function checkHeadingLevels() {
  const skippedHeadings = getSkippedHeadings();
  if (skippedHeadings.length === 0) return;
  const errorMessage = `Skipped heading levels ${skippedHeadings}${exceptionOnDev}`;
  if (!isProd()) {
    throw Error(errorMessage);
  }
  console.error(errorMessage);
}

function getSkippedHeadings() {
  const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6"));
  return headings.some((heading, index, arr) => {
    const precedingHeading = arr[index - 1];
    if (!precedingHeading) return false;
    return (
      parseFloat(heading.tagName.substring(1)) + 1 >
      parseFloat(precedingHeading.tagName.substring(1))
    );
  })
    ? headings
    : [];
}

function isProd() {
  // assume prod unless proven otherwise
  return !process || !process.env || process.env.NODE_ENV === "production";
}

const exceptionOnDev =
  ". This exception is only thrown in non-production environments.";

const MAXIMUM_LEVEL = 6;

const CHECK_AFTER_MS = 500;
