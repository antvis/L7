import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import BreadcrumbStyled from './style/BreadcrumbStyled';
import OlStyled from './style/OlStyled';
import LiStyled from './style/LiStyled';

class Breadcrumb extends React.Component {
  render() {

    const {
      items, primary, secondary, info, success, danger, warning, rtl
    } = this.props;
    const elements = [];
    for (let i = 0; i < items.length - 1; i += 1) {
      elements.push(items[i]);
    }
    const lastElement = items[items.length - 1];
    const themeProps = {
      primary, secondary, info, success, danger, warning, rtl
    };
    return (
      <BreadcrumbStyled {...this.props}>
        <OlStyled {...themeProps}>
          {elements.map((item, index) => {
            return (
              <LiStyled
                key={index}
                {...themeProps}
              >
                <Link
                  to={item.path
                }>
                  {item.name}
                </Link>
              </LiStyled>
            );
          })}
          <LiStyled {...themeProps}>{lastElement.name}</LiStyled>
        </OlStyled>
      </BreadcrumbStyled>
    );
  }
}
Breadcrumb.propTypes = {
  /** array of objects */
  items: PropTypes.array.isRequired,
  /** rtl is true component show  in right side of the window, default is false (from left side). */
  rtl: PropTypes.bool,
  /** Boolean indicating whether the component renders with Theme.primary color */
  primary: PropTypes.bool,
  /** Boolean indicating whether the component renders with Theme.secondary color */
  secondary: PropTypes.bool,
  /** Boolean indicating whether the component renders with Theme.info color */
  info: PropTypes.bool,
  /** Boolean indicating whether the component renders with Theme.warning color  */
  warning: PropTypes.bool,
  /** Boolean indicating whether the component renders with Theme.danger color  */
  danger: PropTypes.bool,
  /** Boolean indicating whether the component renders with Theme.success color */
  success: PropTypes.bool,
  /** The inline-styles for the root element. */
  style: PropTypes.object,
  /** The className for the root element. */
  className: PropTypes.string,
  /** The color renders with Theme.foreColor . */
  foreColor: PropTypes.string
};
Breadcrumb.defaultProps = {
  rtl: false,
  primary: false,
  secondary: false,
  info: false,
  warning: false,
  danger: false,
  success: false,
  style: {},
  className: '',
  foreColor: ''
};
export default Breadcrumb;
