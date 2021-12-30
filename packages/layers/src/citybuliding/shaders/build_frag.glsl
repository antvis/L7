uniform float u_opacity: 1.0;
uniform vec4 u_baseColor : [ 1.0, 0, 0, 1.0 ];
uniform vec4 u_brightColor : [ 1.0, 0, 0, 1.0 ];
uniform vec4 u_windowColor : [ 1.0, 0, 0, 1.0 ];
uniform float u_near : 0;
uniform float u_far : 1;
varying vec4 v_Color;
varying vec2 v_texCoord;
uniform float u_Zoom : 1;
uniform float u_time;

uniform float u_circleSweep;
uniform float u_cityMinSize;
uniform vec3 u_circleSweepColor;
uniform float u_circleSweepSpeed;

varying float v_worldDis;

#pragma include "picking"

vec3 getWindowColor(float n, float hot, vec3 brightColor, vec3 darkColor) {
    float s = step(hot, n);
    vec3 color = mix(brightColor,vec3(0.9,0.9,1.0),n);

    return mix(darkColor, color, s);
}
float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

float LinearizeDepth()
{
    float z = gl_FragCoord.z * 2.0 - 1.0;
    return (2.0 * u_near * u_far) / (u_far + u_near - z * (u_far - u_near));
}

vec3 fog(vec3 color, vec3 fogColor, float depth){
    float fogFactor=clamp(depth,0.0,1.0);
    vec3 output_color=mix(fogColor,color,fogFactor);
    return output_color;
}

float sdRect(vec2 p, vec2 sz) {
  vec2 d = abs(p) - sz;
  float outside = length(max(d, 0.));
  float inside = min(max(d.x, d.y), 0.);
  return outside + inside;
}

void main() {
  gl_FragColor = v_Color;
  vec3 baseColor = u_baseColor.xyz;
  vec3 brightColor = u_brightColor.xyz;
  vec3 windowColor = u_windowColor.xyz;
  float targetColId = 5.;
  float depth = 1.0 - LinearizeDepth() / u_far * u_Zoom;
  vec3 fogColor = vec3(23.0/255.0,31.0/255.0,51.0/255.0);
  if(v_texCoord.x < 0.) { //顶部颜色
       vec3 foggedColor = fog(baseColor.xyz + vec3(0.12*0.9,0.2*0.9,0.3*0.9),fogColor,depth);
       gl_FragColor = vec4( foggedColor, v_Color.w);
  }else { // 侧面颜色
        vec2 st = v_texCoord;
        vec2  UvScale = v_texCoord;
        float tStep = min(0.08,max(0.05* (18.0-u_Zoom),0.02));
        float tStart = 0.25 * tStep;
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
        vec2 windowSize = vec2(abs(tEnd-tStart),abs(tEnd-tStart));
        float dist = sdRect(vec2(u,v), windowSize);
        float s = sU * sV;

        float curColId = floor(UvScale.x / tStep);
        float sCol = step(targetColId - 0.2, curColId) - step(targetColId + 0.2, curColId);

        float mLightP = mod(lightP, 2.);
        float sRow = step(mLightP - 0.2, st.y) - step(mLightP, st.y);
        if(ux == targetColId){
            n =0.;
        }
        float timeP = min(0.75, abs ( sin(u_time/3.0) ) );
        float hot = smoothstep(1.0,0.0,timeP);
        vec3 color = mix(baseColor, getWindowColor(n,hot,brightColor,windowColor), s);
        //vec3 color = mix(baseColor, getWindowColor(n,hot,brightColor,windowColor), 1.0);
        float sFinal = s * sCol * sRow;
        color += mix(baseColor, brightColor, sFinal*n);
        if (st.y<0.01){
        color = baseColor;
         }
        if(head ==1.0) { // 顶部亮线
            color = brightColor;
        }
        color = color * v_Color.rgb;

        vec3 foggedColor = fog(color,fogColor,depth);

        gl_FragColor = vec4(foggedColor,1.0);
  }


  if(u_circleSweep > 0.0 && v_worldDis < u_cityMinSize) {
    float r = fract(((v_worldDis/u_cityMinSize) - u_time * u_circleSweepSpeed) * 2.0);
    gl_FragColor.rgb += r * r * u_circleSweepColor;
  }
   
  gl_FragColor.a *= u_opacity;
  gl_FragColor = filterColor(gl_FragColor);
}
