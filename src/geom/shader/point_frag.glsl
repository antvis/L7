
precision highp float;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_strokeWidth;
uniform vec4 u_stroke;
uniform float u_opacity;
uniform sampler2D u_texture;

varying vec2 v_rs;
varying vec2 v_uv;
varying vec4 v_color;
varying float v_shape;

const float u_buffer = 0.75;
// const float u_gamma = 2.0 * 1.4142 / 10.0;
const float u_gamma = 0.08;
// const float u_scale = 128.0;
const vec3 halo = vec3( 1.0 ); 

void main() {
    // 纹理坐标
    #ifdef TEXCOORD_0
    vec2 pos =  v_uv + gl_PointCoord / 512.0 * 64.0;
    pos.y = 1.0 - pos.y;
    vec4 textureColor = texture2D(u_texture, pos);
    gl_FragColor =textureColor;
    return;
    #endif
     if(v_color.a == 0.)
      discard;
    vec4 pcolor = v_color * u_opacity;
    float ro = v_rs.x;
    float ri = v_rs.y;
    float d = 0.0;
    if(ro < 3.0) {
      gl_FragColor = pcolor;
      return;
    }

    // vec4 textureColor = texture2D(u_texture, gl_PointCoord);
    vec2 st = gl_PointCoord * 2. - 1.;
    float a = atan(st.x,st.y)+PI ;
    float r = TWO_PI/ v_shape;
    float ratio =1.0 + (1.1 - smoothstep(2.8, 6.0,v_shape));
    float dis2center = cos(floor(.5+a/r)*r-a)*length(st) * ro * ratio;
    float alpha = smoothstep(ro,ro+0.1, dis2center);
    
    if(alpha == 1.) {
      discard;
    }
    if(u_strokeWidth > 0.0){//有border
        if(dis2center> ro- u_strokeWidth ){
            gl_FragColor = vec4(u_stroke.xyz,u_stroke.a*(ro- dis2center));
            return;
        }else if(dis2center>ri){
            gl_FragColor= u_stroke * alpha ;
            return;
        }
    }

    if(dis2center > ri- u_strokeWidth){
        float factor = ri-dis2center;//填充色的百分比
        if (u_strokeWidth == 0.0) {
            float a = pcolor.a*factor;
            gl_FragColor = vec4(pcolor.rgb, a);
        } else {
            float a = u_stroke.a*(1.0-factor) +pcolor.a*factor;
            gl_FragColor = vec4(u_stroke.rgb * (1.0-factor) + pcolor.rgb * factor, a);
        }
        } else{
            gl_FragColor= pcolor;
        }
    gl_FragColor *= u_opacity;
}

