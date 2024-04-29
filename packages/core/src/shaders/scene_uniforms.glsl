layout(std140) uniform SceneUniforms {
  mat4 u_ViewMatrix;
  mat4 u_ProjectionMatrix;
  mat4 u_ViewProjectionMatrix;
  mat4 u_ModelMatrix;
  vec4 u_ViewportCenterProjection;
  vec3 u_PixelsPerDegree;
  float u_Zoom;
  vec3 u_PixelsPerDegree2;
  float u_ZoomScale;
  vec3 u_PixelsPerMeter;
  float u_CoordinateSystem;
  vec3 u_CameraPosition;
  float u_DevicePixelRatio;
  vec2 u_ViewportCenter;
  vec2 u_ViewportSize;
  float u_FocalDistance;
};
