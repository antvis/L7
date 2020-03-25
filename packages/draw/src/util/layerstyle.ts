const LayerStyles = {
  // 正常显示样式
  normal_fill: {
    type: 'PolygonLayer',
    shape: 'fill',
    color: '#3bb2d0',
    style: {
      opacity: 0.1,
    },
  },
  // xai'm'z
  active_fill: {
    type: 'PolygonLayer',
    shape: 'fill',
    color: '#fbb03b',
    style: {
      opacity: 0.1,
    },
  },
  normal_point: {
    type: 'PointLayer',
    shape: 'circle',
    color: '#3bb2d0',
    size: 3,
    style: {
      stroke: '#fff',
      strokeWidth: 2,
    },
  },
  mid_point: {
    type: 'PointLayer',
    shape: 'circle',
    color: '#fbb03b',
    size: 3,
    style: {},
  },
  active_point: {
    type: 'PointLayer',
    shape: 'circle',
    color: '#fbb03b',
    size: 5,
    style: {
      stroke: '#fff',
      strokeWidth: 2,
    },
  },
  normal_line: {
    type: 'LineLayer',
    shape: 'line',
    size: 1,
    color: '#3bb2d0',
    style: {
      opacity: 1,
    },
  },
  active_line: {
    type: 'LineLayer',
    shape: 'line',
    color: '#fbb03b',
    size: 1,
    style: {
      opacity: 1,
      lineType: 'dash',
      dashArray: [2, 2],
    },
  },
};

export default LayerStyles;
