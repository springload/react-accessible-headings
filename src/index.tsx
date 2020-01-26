import React, {
  useContext,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode
} from "react";

type LevelContextProps = number;

export const LevelContext = React.createContext<LevelContextProps>(1);

type HeadingLevelProps = {
  value?: number;
  children: ReactNode;
};

export function Level(props: HeadingLevelProps) {
  const { children, value: levelOverride } = props;
  const contextLevel = useContext(LevelContext);
  const newLevel =
    levelOverride !== undefined
      ? parseInt(levelOverride.toString(), 10)
      : contextLevel !== undefined
      ? contextLevel + 1
      : 2;
  assertLevelRange(newLevel);
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
    (level !== undefined ? level : 1) +
    (offset !== undefined ? parseInt(offset.toString(), 10) : 0);
  assertLevelRange(newLevel);
  return React.createElement(`h${newLevel}`, otherProps, children);
}

function assertLevelRange(level: number): void {
  if (level <= 0 || level > MAXIMUM_LEVEL) {
    throw Error(
      `Heading level "${level}" not valid HTML5 which only allows levels 1-${MAXIMUM_LEVEL}.`
    );
  }
}

export function useLevel(): number {
  const level = useContext(LevelContext);
  const newLevel = level !== undefined ? level : 1;
  assertLevelRange(newLevel);
  return newLevel;
}
