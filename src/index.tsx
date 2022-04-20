import {
  createElement,
  createContext,
  useContext,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
} from 'react';

export const HeadingsContext = createContext<
  | undefined
  | {
      level: number;
      hClassName?: string;
    }
>({ level: 1 });

type LevelProps = {
  value?: number;
  children: ReactNode;
  hClassName?: string;
};

export function Level({ children, value, hClassName }: LevelProps) {
  const context = useContext(HeadingsContext);
  const level = levelRange(value !== undefined ? value : context.level + 1);

  return (
    <HeadingsContext.Provider
      value={{
        level,
        hClassName: hClassName || context.hClassName,
      }}
    >
      {children}
    </HeadingsContext.Provider>
  );
}

type HeadingProps = {
  offset?: number;
} & DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

export function H({
  children,
  offset,
  className,
  ...otherProps
}: HeadingProps) {
  const context = useContext(HeadingsContext);
  const proposedLevel = context.level + (offset !== undefined ? offset : 0);
  const level = levelRange(proposedLevel);

  // merge and trim unneeded spaces between classNames
  const mergedClassName = [context.hClassName, className]
    .filter(Boolean)
    .join(' ');

  setTimeout(checkHeadingLevelsDom, CHECK_AFTER_MS);

  // couldn't have JSX syntax, because ts throws
  // "Property 'children' does not exist on type 'IntrinsicAttributes'"
  return createElement(
    `h${level}`,
    { className: mergedClassName, ...otherProps },
    children,
  );
}

function levelRange(level: number): number {
  if (level > 0 && level <= MAXIMUM_LEVEL) {
    return level;
  }
  const errorMessage = `Heading level "${level}" is not valid HTML5 which only allows levels 1-${MAXIMUM_LEVEL}`;
  console.error(errorMessage);
  return Math.min(Math.max(1, level), MAXIMUM_LEVEL);
}

export function useLevel(): number {
  const context = useContext(HeadingsContext);
  setTimeout(checkHeadingLevelsDom, CHECK_AFTER_MS);
  return levelRange(context.level);
}

export function useHClassName(): string | undefined {
  const context = useContext(HeadingsContext);
  return context.hClassName;
}

function checkHeadingLevelsDom() {
  if (typeof window === 'undefined') return; // No need to run during SSR
  checkHeadingLevels(
    Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((elm) =>
      parseFloat(elm.tagName.substring(1)),
    ),
  );
}

export function checkHeadingLevels(headings: number[]): number[] {
  const badHeadings = getBadHeadings(headings);
  if (badHeadings.length > 0) {
    const errorMessage = `WCAG accessibility issue detected: skipped heading levels ${badHeadings.map(
      (num) => `h${num}`,
    )}. See https://www.npmjs.com/package/react-accessible-headings#why`;
    console.error(errorMessage);
  }
  return badHeadings;
}

function getBadHeadings(headings: number[]): number[] {
  return headings.filter(
    // multiple H1s are not recommended. See docs.
    (heading): boolean => heading === 1,
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

const MAXIMUM_LEVEL = 6;

const CHECK_AFTER_MS = 1; // used in setTimeout and browsers will typically clamp this to ~5ms
