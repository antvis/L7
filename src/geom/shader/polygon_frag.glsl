precision highp float;
uniform float u_opacity;
uniform sampler2D u_texture;
uniform vec4 u_baseColor;
uniform vec4 u_brightColor;
uniform vec4 u_windowColor;
uniform float u_time;
varying vec2 v_texCoord;
varying  vec4 v_color;
varying float v_lightWeight;
varying float v_size;
vec3 getWindowColor(float n, float hot, vec3 brightColor, vec3 darkColor) {
    float s = step(hot, n);
    return mix(darkColor, brightColor, s);
}
float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}
void main() {
   if(v_color.w == 0.0) {
     discard;
     return;
   }
    vec3 baseColor = u_baseColor.xyz;
    vec3 brightColor = u_brightColor.xyz;
    vec3 windowColor = u_windowColor.xyz;
    float targetColId = 5.;
   #ifdef ANIMATE 
     if(v_texCoord.x < 0.) { //顶部颜色
       //gl_FragColor = vec4(1.0,0.,0.,1.0);  // v_color.w * u_opacity
       gl_FragColor = vec4(v_color.xyz , v_color.w * u_opacity);
     }else { // 侧面颜色
        //vec4 color = texture2D(u_texture,v_texCoord) * v_color;
        vec2 st = v_texCoord; 
        // st.y = st.y / (3000.0 - v_size) *3000.;
        vec2  UvScale = v_texCoord;
        float tStep = 0.01;
        float tStart = 0.1 * tStep;
        float tEnd = 0.75 * tStep;
        float u = mod(UvScale.x, tStep);
        float v = mod(UvScale.y, tStep);
        float ux = floor(UvScale.x/tStep);
        float uy = floor(UvScale.y/tStep);
        float n = random(vec2(ux,uy));
        float lightP = u_time;
        float head = 1.0- step(0.005,st.y);
        /*step3*/
        // 将窗户颜色和墙面颜色区别开来
        float sU = step(tStart, u) - step(tEnd, u);
        float sV = step(tStart, v) - step(tEnd, v);
        float s = sU * sV;
      
        float curColId = floor(UvScale.x / tStep);
        float sCol = step(targetColId - 0.5, curColId) - step(targetColId + 0.5, curColId);
        
        float mLightP = mod(lightP, 2.);
        float sRow = step(mLightP - 0.2, st.y) - step(mLightP, st.y);
        if(ux == targetColId){
            n =0.;
        }
        vec3 color = mix(baseColor, getWindowColor(n,0.6,brightColor,windowColor), s);
        float sFinal = s * sCol * sRow;
        color += mix(baseColor, brightColor, sFinal);
        if (st.y<0.01){
        color = baseColor;
         }
        if(head ==1.0) { // 顶部亮线
            color = brightColor;
        }
        gl_FragColor = vec4(color * v_lightWeight,1.0); 
      //gl_FragColor = color;
     }
   #else
       gl_FragColor = vec4(v_color.xyz , v_color.w * u_opacity);
   #endif
 
}