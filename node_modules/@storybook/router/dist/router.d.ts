import React from 'react';
import { LocationProvider, RouteComponentProps } from '@reach/router';
interface Other {
    viewMode?: string;
    storyId?: string;
}
export declare type RenderData = RouteComponentProps & Other;
interface MatchingData {
    match: null | {
        path: string;
    };
}
interface QueryLocationProps {
    children: (renderData: RenderData) => React.ReactNode;
}
interface QueryMatchProps {
    path: string;
    startsWith: boolean;
    children: (matchingData: MatchingData) => React.ReactNode;
}
interface RouteProps {
    path: string;
    startsWith: boolean;
    hideOnly: boolean;
    children: (renderData: RenderData) => React.ReactNode;
}
interface QueryLinkProps {
    to: string;
    children: React.ReactNode;
}
declare const queryNavigate: (to: string) => void;
declare const QueryLink: {
    ({ to, children, ...rest }: QueryLinkProps): JSX.Element;
    displayName: string;
};
declare const QueryLocation: {
    ({ children }: QueryLocationProps): JSX.Element;
    displayName: string;
};
declare const QueryMatch: {
    ({ children, path: targetPath, startsWith }: QueryMatchProps): JSX.Element;
    displayName: string;
};
declare const Route: {
    ({ path, children, startsWith, hideOnly }: RouteProps): JSX.Element;
    displayName: string;
};
export { QueryLink as Link };
export { QueryMatch as Match };
export { QueryLocation as Location };
export { Route };
export { queryNavigate as navigate };
export { LocationProvider };
