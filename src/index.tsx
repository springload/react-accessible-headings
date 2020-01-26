import React, {
  useContext,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode
} from "react";

type LevelContextProps = number;

export const LevelContext = React.createContext<LevelContextProps>(1);

type HeadingLevelProps = {
  depth?: number;
  children: ReactNode;
};

export function Level(props: HeadingLevelProps) {
  const { children, depth: levelOverride } = props;
  const contextLevel = useContext(LevelContext);
  const newLevel =
    levelOverride !== undefined
      ? levelOverride
      : contextLevel !== undefined
      ? contextLevel + 1
      : 2;
  return (
    <LevelContext.Provider value={newLevel}>{children}</LevelContext.Provider>
  );
}

type HeadingProps = {
  offset?: number;
} & DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

const MAXIMUM_LEVEL = 6;

export function H(props: HeadingProps) {
  const { children, offset, ...otherProps } = props;
  const level = useContext(LevelContext);
  const newLevel =
    (level !== undefined ? level : 1) + (offset !== undefined ? offset : 0);
  if (newLevel > MAXIMUM_LEVEL) {
    throw Error(
      `Heading level "${newLevel}" exceeds maximum level of ${MAXIMUM_LEVEL}.`
    );
  }
  return React.createElement(`h${newLevel}`, otherProps, children);
}
