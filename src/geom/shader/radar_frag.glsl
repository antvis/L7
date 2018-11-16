//Sci-fi radar based on the work of gmunk for Oblivion
//http://work.gmunk.com/OBLIVION-GFX
precision highp float;
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
float movingLine(vec2 uv, vec2 center, float radius)
{
    //angle of the line
    float theta0 = 90. * u_time;
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    if(r<radius)
    {
        //compute the distance to the line theta=theta0
        vec2 p = radius*vec2(cos(theta0*M_PI/180.0),
                            -sin(theta0*M_PI/180.0));
        float l = length( d - p*clamp( dot(d,p)/dot(p,p), 0.0, 1.0) );
    	d = normalize(d);
        //compute gradient based on angle difference to theta0
   	 	float theta = mod(180.0*atan(d.y,d.x)/M_PI+theta0,360.0);
        float gradient = clamp(1.0-theta/90.0,0.0,1.0);
        return SMOOTH(l,0.01) + 0.9*gradient;
        // return SMOOTH(l,1.);
    }
    else return 0.0;
}

float circle(vec2 uv, vec2 center, float radius, float width)
{
    float r = length(uv - center);
    return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);
}


float _cross(vec2 uv, vec2 center, float radius)
{
    vec2 d = uv - center;
    float x = uv.x;
    float y = uv.y;
    float r = sqrt( dot( d, d ) );
   

     float w = abs(uv.x)-abs(uv.y);
     float z1 = smoothstep(-0.020,-0.012,w);
     float z2 = smoothstep(-0.02,-0.012,-w);
     float z3 = z1*z2 * (1.0 - step(radius,r));
     return z3;
}

void main()
{
    vec3 finalColor;
	vec2 uv = gl_PointCoord.xy * 2.0 - 1.0;
    vec2 c = vec2(0.,0.);
    finalColor = vec3( 0.3 * _cross(uv, c, 0.6) );
    finalColor += ( circle(uv, c, 0.2, 0.01)
                   + circle(uv, c, 0.4, 0.01) ) * blue1;
    finalColor += (circle(uv, c, 0.6, 0.02) );
    finalColor += movingLine(uv, c, 0.6) * blue3;
    finalColor += circle(uv, c, 0.1, 0.01) * blue3;

    float alpha = 1.0;
    if(finalColor==vec3(0.)) alpha = 0.;
    gl_FragColor = vec4(finalColor, alpha);
}