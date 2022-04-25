// @ts-nocheck
import React from 'react';
import {styled, withStyles} from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

const PositionContainer = styled('div')({
  position: 'absolute',
  zIndex: 1,
  bottom: '40px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

const SliderInput = withStyles({
  root: {
    marginLeft: 12,
    width: '40%'
  },
  valueLabel: {
    '& span': {
      background: 'none',
      color: '#000'
    }
  }
})(Slider);

export default function RangeInput({min, max, value, onChange}) {
  return (
    <PositionContainer>
      <SliderInput
        min={min}
        max={max}
        value={value}
        onChange={(event, newValue) => onChange(newValue)}
        valueLabelDisplay="auto"
        valueLabelFormat={t => t}
      />
    </PositionContainer>
  );
}
