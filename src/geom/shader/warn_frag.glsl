#ifdef GL_ES
precision mediump float;
#endif
#define SMOOTH(r,R) (1.0-smoothstep(R-0.01,R+0.01, r))
#define RANGE(a,b,x) ( step(a,x)*(1.0-step(b,x)) )
#define RS(a,b,x) ( smoothstep(a-0.01,a+0.01,x)*(1.0-smoothstep(b-0.01,b+0.01,x)) )
#define M_PI 3.1415926535897932384626433832795

#define blue1 vec3(0.74,0.95,1.00)
#define blue2 vec3(0.87,0.98,1.00)
#define blue3 vec3(0.35,0.76,0.83)
#define blue4 vec3(0.953,0.969,0.89)
#define red   vec3(1.00,0.38,0.227)

#define MOV(a,b,c,d,t) (vec2(a*cos(t)+b*cos(0.1*(t)), c*sin(t)+d*cos(0.1*(t))))
uniform float u_time;
varying vec2 v_texCoord;
varying  vec4 v_color;
float bip2(vec2 uv, vec2 center)
{
    float r = length(uv - center);
    float R = 0.2+mod(0.1*u_time, 0.30);
    return (0.5-0.6*cos(30.0*u_time)) * SMOOTH(r,0.06)
        + SMOOTH(0.1,r)-SMOOTH(0.12,r) 
        + smoothstep(max(0.1,R-0.2),R,r)-SMOOTH(R,r);
}
void main() {
    vec3 finalColor;
    vec2 uv = v_texCoord * 2.0 - 1.0;
    vec2 c = vec2(0.,0.);
    if( length(uv-c) < 0.96 )
    {
        finalColor += bip2(uv,c) * v_color.xyz;
    }
    float alpha = 1.0;
    if(finalColor==vec3(0.)) alpha = 0.;
    gl_FragColor = vec4(finalColor, alpha);
    
}