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
  levelRange(newLevel);
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
  const propopsedNewLevel =
    (level !== undefined ? level : 1) +
    (offset !== undefined ? parseInt(offset.toString(), 10) : 0);

  const newLevel = levelRange(propopsedNewLevel);
  return React.createElement(`h${newLevel}`, otherProps, children);
}

function levelRange(level: number): number {
  if (level <= 0 || level > MAXIMUM_LEVEL) {
    const errorMessage = `Heading level "${level}" is not valid HTML5 which only allows levels 1-${MAXIMUM_LEVEL}.`;
    if (process && process.env && process.env.NODE_ENV === "development") {
      throw Error(errorMessage);
    } else {
      console.error(errorMessage);
    }

    // clamp values
    if (level > MAXIMUM_LEVEL) {
      return MAXIMUM_LEVEL;
    } else if (level < 1) {
      return 1;
    }
  }

  return level;
}

export function useLevel(): number {
  const level = useContext(LevelContext);
  const propopsedNewLevel = level !== undefined ? level : 1;
  const newLevel = levelRange(propopsedNewLevel);
  return newLevel;
}
