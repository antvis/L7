export enum DrawEvent {
  CREATE = 'draw.create',
  DELETE = 'draw.delete',
  Move = 'draw.move',
  Edit = 'draw.edit',
  UPDATE = 'draw.update',
  SELECTION_CHANGE = 'draw.selectionchange',
  MODE_CHANGE = 'draw.modechange',
  ACTIONABLE = 'draw.actionable',
  RENDER = 'draw.render',
  COMBINE_FEATURES = 'draw.combine',
  UNCOMBINE_FEATURES = 'draw.uncombine',
}

export enum DrawModes {
  DRAW_Circle = 'draw_circle',
  DRAW_Rect = 'draw_react',
  DRAW_LINE_STRING = 'draw_line_string',
  DRAW_POLYGON = 'draw_polygon',
  DRAW_POINT = 'draw_point',
  SIMPLE_SELECT = 'simple_select',
  DIRECT_SELECT = 'direct_select',
  STATIC = 'static',
}

export type unitsType = 'degrees' | 'radians' | 'miles' | 'kilometers';

export enum FeatureType {
  FEATURE = 'Feature',
  POLYGON = 'Polygon',
  LINE_STRING = 'LineString',
  POINT = 'Point',
  FEATURE_COLLECTION = 'FeatureCollection',
  MULTI_PREFIX = 'Multi',
  MULTI_POINT = 'MultiPoint',
  MULTI_LINE_STRING = 'MultiLineString',
  MULTI_POLYGON = 'MultiPolygon',
}
