// @flow

import * as React from 'react';
import styled from 'styled-components';

type Button = {
  margin?: string,
  bgColor?: string,
  hoverColor?: string,
}

export const StyledButton = (styled.button`
  margin: ${props => (props.margin ? props.margin : '10px')};
  height: 40px;
  max-width: 254px;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  border-radius: 2px;
  background-color: ${props => (props.bgColor ? props.bgColor : 'rgb(255, 168, 39)')};

  &:hover {
    background: ${props => (props.hoverColor ? props.hoverColor : '#81A2CA')};
  }
`: React.ComponentType<Button>);
