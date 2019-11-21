/* @flow */

/* eslint-disable no-use-before-define */

import type {BaseStyle} from './BaseStyle'

export type JssStyle = {
  ...$Exact<BaseStyle>,
  ...$Exact<JssCustomStyle>,
}

type JssCustomStyle = {|
  extend?: string | JssStyle,
  composes?: string | string[],
  [selector: string]: JssStyle,
|}
