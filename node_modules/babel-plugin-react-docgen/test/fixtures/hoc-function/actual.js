import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './testSelector';

const TestComponent = (props) => {
    const { text, onClick } = props;

    return (
        <div>
            <div>Text: {text}</div>
            <button onClick={onClick}>Button</button>
        </div>
    );
};

TestComponent.propTypes = {
    /** Text to display */
    text: PropTypes.string,
    /** Called on click */
    onClick: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(TestComponent);
