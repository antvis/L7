import { DOM } from '@antv/l7-utils';

export const createL7Icon = (className: string) => {
  return DOM.create('i', `l7-iconfont ${className}`);
};
