
precision highp float;
uniform sampler2D u_texture;
uniform vec2 u_dimension;
varying vec2 v_texCoord;
varying vec4 v_color;
uniform float u_min;
uniform float u_max;
#define PI 3.141592653589793

void main() {
     float value = texture2D(u_texture,v_texCoord)[0];
     if(value > u_max || u_min > value ) {
        discard;
      }
      vec2 u_latrange = vec2(3.83718,53.5636);
      float u_zoom = 7.0;
      float u_maxzoom= 10.0;
      vec2 epsilon = 1.0 / u_dimension;
      vec2 u_light = vec2(0.5000, 5.8469);
      vec4 u_accent = vec4(0.,0.,0.,1.);
      vec4 u_highlight = vec4(1.0);
      vec4 u_shadow = vec4(0.,0.,0.,1.);
      float a = texture2D(u_texture,v_texCoord - epsilon)[0];
      float b = texture2D(u_texture,v_texCoord+vec2(0,-epsilon.y))[0];
      float c = texture2D(u_texture,v_texCoord+ vec2(epsilon.x - epsilon.y))[0];
      float d = texture2D(u_texture,v_texCoord+ vec2(-epsilon.x,0))[0];
      float e = texture2D(u_texture,v_texCoord)[0];
      float f = texture2D(u_texture,v_texCoord+ vec2(epsilon.x,0))[0];
      float g = texture2D(u_texture,v_texCoord+ vec2(-epsilon.x,epsilon.y))[0];
      float h = texture2D(u_texture,v_texCoord+ vec2(0,epsilon.y))[0];
      float i = texture2D(u_texture,v_texCoord+ epsilon)[0];
      float exaggeration = u_zoom < 2.0 ? 0.4 : u_zoom < 4.5 ? 0.35 : 0.3;

      vec2 deriv = vec2(
          (c + f + f + i) - (a + d + d + g),
          (g + h + h + i) - (a + b + b + c)
      ) /  pow(2.0, (u_zoom - u_maxzoom) * exaggeration + 19.2562 - u_zoom);
      float scaleFactor = cos(radians((u_latrange[0] - u_latrange[1]) * (1.0 - v_texCoord.y) + u_latrange[1]));
      float slope = atan(1.25 * length(deriv) / scaleFactor);
      float aspect = deriv.x != 0.0 ? atan(deriv.y, -deriv.x) : PI / 2.0 * (deriv.y > 0.0 ? 1.0 : -1.0);
      
      float intensity = u_light.x;
      float azimuth = u_light.y + PI;

      float base = 1.875 - intensity * 1.75;
      float maxValue = 0.5 * PI;
      float scaledSlope = intensity != 0.5 ? ((pow(base, slope) - 1.0) / (pow(base, maxValue) - 1.0)) * maxValue : slope;

      float accent = cos(scaledSlope);
      // We multiply both the accent and shade color by a clamped intensity value
      // so that intensities >= 0.5 do not additionally affect the color values
      // while intensity values < 0.5 make the overall color more transparent.
      vec4 accent_color = (1.0 - accent) * u_accent * clamp(intensity * 2.0, 0.0, 1.0);
      float shade = abs(mod((aspect + azimuth) / PI + 0.5, 2.0) - 1.0);
      vec4 shade_color = mix(u_shadow, u_highlight, shade) * sin(scaledSlope) * clamp(intensity * 2.0, 0.0, 1.0);
      gl_FragColor = v_color * (1.0 - shade_color.a) + shade_color;


      gl_FragColor =v_color;

}