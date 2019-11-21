#ifdef GL_ES
precision highp float;
#endif

// Fractal surface - by Thomas Lowe
// Some code based on Mandelbulb example by Syntopia
const int maxIterations = 6;
#define VIEW_FULL_TRIANGLE 0
#define SHADOWS_ENABLED 1
const float shadowStrength = 0.8;
#define REVERSE_TRI1 0

#define REVERSE_TRI0 0
#define REVERSE_TRI2 0
#define REVERSE_TRI3 0
#define REVERSE_TRI4 0
#define REVERSE_TRI5 0

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform sampler2D backbuffer;

float PI=3.14159265;
float angle = 0.0;
float height = 0.0;

const int numSegments = 6;
vec3 centres[numSegments];
vec3 segmentOffsets[numSegments];
float segmentScales[numSegments];
mat3 rotations[numSegments]; 
vec3 corners[3];
float DE(vec3);

// Compute the distance from `pos` to the surface
float DE(vec3 pos) {
  vec3 middle = vec3(segmentOffsets[0][0], 0, segmentOffsets[0][2]);
  pos += middle;
  float totalScale = 1.0;
  for (int it = 0; it<maxIterations; it++)
  {
    // find closest
    mat3 rotation = rotations[0];
    vec3 offset = segmentOffsets[0];
    float scale = segmentScales[0];
    vec3 toPos = pos - centres[0];
    float closest = dot(toPos, toPos);
    for (int i = 1; i<numSegments; i++)
    {
      vec3 to = pos - centres[i];
      float dt = dot(to, to);
      if (dt < closest && (it>0 || i<4))
      {
        closest = dt;
        rotation = rotations[i];
        offset = segmentOffsets[i];
        scale = segmentScales[i];
      }
    }
    pos -= offset;
    pos = pos * rotation;
    totalScale *= scale;
/*    vec3 dif = pos - middle;
    float blah = dot(dif, dif);
    if (blah > 3.0)
      break;*/
  }

  vec3 normal = normalize(cross(corners[2]-corners[0], corners[1] - corners[0]));
  float h = dot(pos - corners[0], normal);
  vec3 onPlane = pos - normal * h;
  vec3 lines[3];
  lines[0] = corners[1] - corners[0]; lines[1] = corners[2] - corners[1]; lines[2] = corners[0] - corners[2];
  for (int i = 0; i<3; i++)
  {
    vec3 dif = onPlane - corners[i];
    vec3 norm = cross(normal, lines[i]);
    float dist = dot(dif, norm) / dot(norm, norm);
    if (dist > 0.0)
    {
      onPlane -= norm * dist;
      float along = dot(dif, lines[i]) / dot(lines[i], lines[i]);
      if (along < 0.0)
        onPlane -= lines[i] * along;
      else if (along > 1.0)
        onPlane -= lines[i] * (along - 1.0);
      break;
    }
  }
  return length(onPlane - pos) / totalScale;
}
#if SHADOWS_ENABLED==1
// Uses the soft-shadow approach by Quilez:
// http://iquilezles.org/www/articles/rmshadows/rmshadows.htm
float shadow(vec3 pos, vec3 sdir, float eps) {
  float totalDist =2.0*eps;
  float s = 1.0; // where 1.0 means no shadow!
  for (int steps=0; steps<30; steps++) {
    vec3 p = pos + totalDist * sdir;
    float dist = DE(p);
    if (dist < eps)  return 1.0;
    s = min(s, 4.0*(dist/totalDist));
    totalDist += dist;
  }
  return 1.0-s;
}
#endif


void calculateSegments()
{
  height = 2.3*(mouse.y - 0.5); // -1 to 1 about
  float limit = 0.6;
  if (height > limit)
    height = limit;
  else if (height < -limit)
    height = -limit;
        angle = PI/2.0;
  for (int i = 0; i<5; i++)
  {
    float cosa = cos(angle);
    float sina = sin(angle);
    float denom = 1.0/(4.0*height*height + sina*sina);
    angle = atan(sqrt((1.0 + 2.0*cosa + cosa*cosa) * denom)) + atan(sqrt((1.0 - 2.0*cosa + cosa*cosa)*denom));
  }
  // we assume corner0 is 0,0 corner1 is 1,0, corner2 is sin(bendAngle),cos(bendAngle)
  // these are corners of the parallelegram, so corner3 is corner1+corner2
  float cosa = cos(angle);
  float sina = sin(angle);
  vec3 x = vec3(1,0,0);
  vec3 z = vec3(cosa, 0, sina);
  vec3 end = x + z;
  vec3 top = end*0.5 + vec3(0, height, 0);
  segmentOffsets[0] = segmentOffsets[1] = segmentOffsets[2] = segmentOffsets[3] = top;
  segmentOffsets[4] = z;
  segmentOffsets[5] = x;
  centres[0] = (x + top)/3.0;
  centres[1] = (z + top)/3.0;
  centres[2] = (x + top + end)/3.0;
  centres[3] = (z + top + end)/3.0;
  float sideLengthC = length(top);
  float sideLengthB = length(vec3(1,0,0) - top);
  float scale = 1.0/sideLengthC + 1.0/sideLengthB;
  segmentScales[0] = segmentScales[1] = segmentScales[2] = segmentScales[3] = scale;
  segmentScales[4] = sideLengthB*scale;
  segmentScales[5] = sideLengthC*scale;
  corners[0] = vec3(0,0,0);
  corners[1] = x * (1.0 + sideLengthB / sideLengthC);
  corners[2] = z * (1.0 + sideLengthC / sideLengthB);
  
  // now I need to work out the rotation matrices for each segment
  rotations[0][0] = normalize(x - top);
  rotations[0][1] = -normalize(cross(rotations[0][0], top));
  rotations[0][2] = -cross(rotations[0][0], rotations[0][1]);
  rotations[1][0] = normalize(z - top);
  rotations[1][1] = normalize(cross(rotations[1][0], top));
  rotations[1][2] = cross(rotations[1][0], rotations[1][1]);
  
  rotations[2][0] = rotations[0][0];
  rotations[2][1] = normalize(cross(rotations[2][0], top-end));
  rotations[2][2] = cross(rotations[2][0], rotations[2][1]);
  rotations[3][0] = rotations[1][0];
  rotations[3][1] = -normalize(cross(rotations[3][0], top-end));
  rotations[3][2] = -cross(rotations[3][0], rotations[3][1]);
  rotations[0] *= segmentScales[0];
  rotations[1] *= segmentScales[1];
  rotations[2] *= segmentScales[2];
  rotations[3] *= segmentScales[3];
  
  rotations[4] = mat3(segmentScales[4]);
  rotations[5] = mat3(segmentScales[5]);
  #if REVERSE_TRI0==1
  rotations[0][1] *= -1.0;
  #endif
  #if REVERSE_TRI1==1
  rotations[1][1] *= -1.0;
  #endif
  #if REVERSE_TRI2==1
  rotations[2][1] *= -1.0;
  #endif
  #if REVERSE_TRI3==1
  rotations[3][1] *= -1.0;
  #endif
  #if REVERSE_TRI4==1
  rotations[4][1] *= -1.0;
  #endif
  #if REVERSE_TRI5==1
  rotations[5][1] *= -1.0;
  #endif
  
  // lastly, work out the centres for 4 and 5, this should be optimised for biggest range of height
  vec3 norm = cross(end-x, vec3(0,1,0)); // modify this up vector for variation
  centres[5] = centres[2] + 2.0 * norm * dot(norm, x - centres[2])/dot(norm, norm);
  norm = cross(end-z, vec3(0,1,0));
  centres[4] = centres[3] + 2.0 * norm * dot(norm, z - centres[3])/dot(norm, norm);    
}

void main(void){
  calculateSegments();
  vec2 vPos=0.5*(-1.0+2.0*gl_FragCoord.xy/resolution.xy);
  
  float t = 0.2*time;
  if (height < 0.0)
    t += PI/2.0;
  float sinA = sin(t);
  float cosA = cos(t);
  mat3 bearing = mat3(vec3(cosA, 0, sinA), vec3(0,1,0), vec3(-sinA, 0, cosA));

  //Camera animation
  vec3 vuv=vec3(0,1,0);//Change camere up vector here
  vec3 vrp=vec3(0,0,0); //Change camere view here
  float mx=0.0;
  float my=0.5*PI/2.01;
  vec3 prp=bearing * vec3(cos(my),sin(my),0.0)*2.0; //Trackball style camera pos
  
  
  //Camera setup
  vec3 vpn=normalize(vrp-prp);
  vec3 u=normalize(cross(vuv,vpn));
  vec3 v=cross(vpn,u);
  vec3 vcv=(prp+vpn);
  vec3 scrCoord=vcv+vPos.x*u*resolution.x/resolution.y+vPos.y*v;
  vec3 scp=normalize(scrCoord-prp);
  
  //Raymarching
  const vec3 e=vec3(0.000001,0,0);
  const float maxd=3.0; //Max depth
  float s=0.0;
  vec3 c,p,n;
  
  float f=0.80;

  for(int i=0;i<46;i++){
    f+=s*0.8;
    p=prp+scp*f;
    s=DE(p);
    if (s<.00065||f>maxd) 
      break;
  }

  
  if (f<maxd){
    n=normalize(
      vec3(s-DE(p-e.xyy),
        s-DE(p-e.yxy),
        s-DE(p-e.yyx)));
    
    //c.yz = mix(c.yz, n.yz, 0.3);
    vec3 dir = normalize(prp-p);
    vec3 spotDir = bearing * normalize(vec3(-1.0,-2.0,1.5));
    // Calculate perfectly reflected light
    vec3 r = spotDir - 2.0 * dot(n, spotDir) * n;
    float s = max(0.0,dot(dir,-r));
    float diffuse = max(0.0,dot(-n,spotDir))*0.60;
    float ambient =1.0;
    float specular = 0.0;//clamp(pow(s,50.0)*1.1,0.0,0.5);
    #if SHADOWS_ENABLED==1
    float eps = 0.001;
    if (shadowStrength>0.0) {
      // check path from pos to spotDir
      float strength = shadow(p+n*eps, -spotDir, eps);
      ambient = mix(ambient,0.0,shadowStrength*strength);
      diffuse = mix(diffuse,0.0,shadowStrength*strength);
      if (strength>0.0) 
        specular = 0.0; // always turn off specular, if blocked
    }
    #endif
    gl_FragColor=vec4((vec3(1.0)*diffuse+vec3(1.0)*ambient+ specular*vec3(1.0))*vec3(0.5),1.0);
  }
}

