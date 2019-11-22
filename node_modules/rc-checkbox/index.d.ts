import * as React from "react";

export interface Props {
  prefixCls?: string,
  className?: string,
  style?: React.CSSProperties,
  name?: string,
  id?: string,
  type?: string,
  defaultChecked?: number | boolean,
  checked?: number | boolean,
  disabled?: boolean,
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void,
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void,
  onChange?: (e: Event) => void,
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void,
  tabIndex?: string | number,
  readOnly?: boolean,
  autoFocus?: boolean,
  value?: any,
}

export default class CheckBox extends React.Component<Props> {}
