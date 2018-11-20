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

float circle2(vec2 uv, vec2 center, float radius, float width, float opening)
{
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    d = normalize(d);
    if( abs(d.y) > opening )
	    return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);
    else
        return 0.0;
}
float circle3(vec2 uv, vec2 center, float radius, float width)
{
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    d = normalize(d);
    float theta = 180.0*(atan(d.y,d.x)/M_PI);
    return smoothstep(2.0, 2.1, abs(mod(theta+2.0,45.0)-2.0)) *
        mix( 0.5, 1.0, step(45.0, abs(mod(theta, 180.0)-90.0)) ) *
        (SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius));
}

float triangles(vec2 uv, vec2 center, float radius)
{
    vec2 d = uv - center;
    return RS(-0.08, 0.0, d.x-radius) * (1.0-smoothstep( 0.07+d.x-radius,0.09+d.x-radius, abs(d.y)))
         + RS( 0.0, 0.08, d.x+radius) * (1.0-smoothstep( 0.07-d.x-radius,0.09-d.x-radius, abs(d.y)))
         + RS(-0.08, 0.0, d.y-radius) * (1.0-smoothstep( 0.07+d.y-radius,0.09+d.y-radius, abs(d.x)))
         + RS( 0.0, 0.08, d.y+radius) * (1.0-smoothstep( 0.07-d.y-radius,0.09-d.y-radius, abs(d.x)));
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




    // float x = uv.x;
    // float y = uv.y;
    //color = vec3(1.0-smoothstep(.4,.41,d));
     
    //return  smoothstep()
    // float r = sqrt( dot( d, d ) );
    // if( (r<radius) && ( (x==y) || (x==-y) ) )
    //     return 1.0;
    // else return 0.0;
}
float dots(vec2 uv, vec2 center, float radius)
{
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    if( r <= 2.5 )
        return 1.0;
    if( ( r<= radius) && ( (abs(d.y+0.5)<=1.0) && ( mod(d.x+1.0, 50.0) < 2.0 ) ) )
        return 1.0;
    else if ( (abs(d.y+0.5)<=1.0) && ( r >= 50.0 ) && ( r < 115.0 ) )
        return 0.5;
    else
	    return 0.0;
}
float bip1(vec2 uv, vec2 center)
{
    return SMOOTH(length(uv - center),0.03);
}
float bip2(vec2 uv, vec2 center)
{
    float r = length(uv - center);
    float R = 0.2+mod(0.1*u_time, 0.30);
    return (0.5-0.6*cos(30.0*u_time)) * SMOOTH(r,0.06)
        + SMOOTH(0.1,r)-SMOOTH(0.12,r) 
        + smoothstep(max(0.1,R-0.2),R,r)-SMOOTH(R,r);
}
void main()
{
    vec3 finalColor;
	vec2 uv = gl_PointCoord.xy * 2.0 - 1.0;
    //center of the image
    vec2 c = vec2(0.,0.);
    finalColor = vec3( 0.3 * _cross(uv, c, 0.6) );
    finalColor += ( circle(uv, c, 0.2, 0.01)
                   + circle(uv, c, 0.4, 0.01) ) * blue1;
    finalColor += (circle(uv, c, 0.6, 0.02) );//+ dots(uv,c,240.0)) * blue4;
    finalColor += circle3(uv, c, 0.8, 0.04) * blue1;
    finalColor += triangles(uv, c, 0.85 + 0.1*sin(u_time)) * blue2;
    finalColor += movingLine(uv, c, 0.6) * blue3;
    finalColor += circle(uv, c, 0.1, 0.01) * blue3;
    finalColor +=   circle2(uv, c, 0.65, 0.01, 0.5+0.2*cos(u_time)) * blue3;
    if( length(uv-c) < 0.6 )
    {
        //animate some bips with random movements
        vec2 p = 0.6*MOV(0.013,0.01,0.01,0.014,0.03+0.01*u_time);
       finalColor += bip1(uv, c+p) * vec3(1,1,1);
        p = 0.6*MOV(0.009,-0.01,0.017,0.08,-2.0+sin(0.1*u_time)+0.15*u_time);
       //finalColor += bip1(uv, c+p) * vec3(1,1,1);
        p = 0.50*MOV(-0.354,0.37,-0.237,0.28,sin(1.*u_time+0.07)+0.2*u_time);
        finalColor += bip2(uv,c+ p) * red;
    }
    float alpha = 1.0;
    if(finalColor==vec3(0.)) alpha = 0.;
    gl_FragColor = vec4(finalColor, alpha);
}