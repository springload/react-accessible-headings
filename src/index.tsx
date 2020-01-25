import React, {
  useContext,
  ReactNode,
  ReactChild,
  DetailedHTMLProps,
  HTMLAttributes
} from "react";

type LevelContextProps = number;

export const LevelContext = React.createContext<LevelContextProps>(1);

type HeadingLevelProps = {
  children: ReactChild;
};

export function Level(props: HeadingLevelProps): ReactNode {
  const { children } = props;
  const level = useContext(LevelContext);
  const newLevel = level !== undefined ? level + 1 : 2;
  // assertValidLevel(newLevel); // Harmless to increase depth beyond
  return (
    <LevelContext.Provider value={newLevel}>{children}</LevelContext.Provider>
  );
}

type HeadingProps = {
  offset?: number;
} & DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

export function H(props: HeadingProps): ReactNode {
  const { children, offset } = props;
  const level = useContext(LevelContext);
  const newLevel =
    (level !== undefined ? level : 1) + offset !== undefined ? offset : 0;
  assertValidLevel(newLevel);

  return React.createElement(
    `h${level === undefined ? 1 : level}`,
    null,
    children
  );
}

const assertValidLevel = (level: number): void => {
  if (level > MAXIMUM_LEVEL) {
    throw Error(
      `Heading level "${level}" exceeds maximum level of ${MAXIMUM_LEVEL}.`
    );
  }
};

const MAXIMUM_LEVEL = 6;
