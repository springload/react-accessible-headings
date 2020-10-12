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

export function Level(props: LevelProps) {
  const { children, value: levelOverride } = props;
  const contextLevel = useContext(LevelContext);
  const newLevel =
    levelOverride !== undefined
      ? parseInt(levelOverride.toString(), 10)
      : contextLevel + 1;
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
  const contextLevel = useContext(LevelContext);
  const proposedLevel =
    contextLevel + (offset !== undefined ? parseInt(offset.toString(), 10) : 0);

  const level = levelRange(proposedLevel);

  const Heading = `h${level}`;
  return <Heading {...otherProps}>{children}</Heading>;
}

function levelRange(level: number): number {
  if (level <= 0 || level > MAXIMUM_LEVEL) {
    const errorMessage = `Heading level "${level}" is not valid HTML5 which only allows levels 1-${MAXIMUM_LEVEL}.`;
    if (process && process.env && process.env.NODE_ENV !== "production") {
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
  const contextLevel = useContext(LevelContext);
  return levelRange(contextLevel);
}
