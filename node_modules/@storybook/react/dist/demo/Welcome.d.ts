import PropTypes from 'prop-types';
declare const Welcome: {
    ({ showApp }: {
        showApp: () => void;
    }): JSX.Element;
    displayName: string;
    propTypes: {
        showApp: PropTypes.Requireable<(...args: any[]) => any>;
    };
    defaultProps: {
        showApp: any;
    };
};
export { Welcome as default };
