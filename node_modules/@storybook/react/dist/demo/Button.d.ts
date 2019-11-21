import React from 'react';
import PropTypes from 'prop-types';
declare const Button: {
    ({ children, onClick, }: {
        children: React.ReactChildren;
        onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    }): JSX.Element;
    displayName: string;
    propTypes: {
        children: PropTypes.Validator<PropTypes.ReactNodeLike>;
        onClick: PropTypes.Requireable<(...args: any[]) => any>;
    };
    defaultProps: {
        onClick: () => void;
    };
};
export default Button;
