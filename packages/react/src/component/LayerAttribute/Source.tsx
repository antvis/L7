import { ILayer } from '@antv/l7';
import * as React from 'react';
import { ISourceOptions } from './';

const { useEffect } = React;
interface ISourceProps {
  layer: ILayer;
  source: Partial<ISourceOptions>;
}
export default React.memo(function Chart(props: ISourceProps) {
  const { layer, source } = props;
  const { data, ...sourceOption } = source;

  useEffect(() => {
    if (!layer.inited) {
      layer.source(data, sourceOption);
    } else {
      layer.setData(data, sourceOption);
    }
    // 临时解决：若开启，每次更新之后自适应缩放；
    // TODO：是否可以统一到Layer的option里，目前问题是Layer的autoFit一直为true，无法触发更新
    if (sourceOption.autoFit) {
      layer.fitBounds();
    }
  }, [data, JSON.stringify(sourceOption)]);
  return null;
});
