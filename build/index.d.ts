import React, { ReactNode, ReactChild, DetailedHTMLProps, HTMLAttributes } from "react";
export declare const LevelContext: React.Context<number>;
declare type HeadingLevelProps = {
    children: ReactChild;
};
export declare function Level(props: HeadingLevelProps): ReactNode;
declare type HeadingProps = {
    offset?: number;
} & DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
export declare function H(props: HeadingProps): ReactNode;
export {};
