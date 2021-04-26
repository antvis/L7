
#define E 2.718281828459045
vec2 ProjectFlat(vec2 lnglat){
  float maxs=85.0511287798;
  float lat=max(min(maxs,lnglat.y),-maxs);
  float scale= 268435456.;
  float d=PI/180.;
  float x=lnglat.x*d;
  float y=lat*d;
  y=log(tan((PI/4.)+(y/2.)));

  float a=.5/PI,
  b=.5,
  c=-.5/PI;
  d=.5;
  x=scale*(a*x+b);
  y=scale*(c*y+d);
  return vec2(x,y);
}

vec2 unProjectFlat(vec2 px){
  float a=.5/PI;
  float b=.5;
  float c=-.5/PI;
  float d=.5;
  float scale = 268435456.;
  float x=(px.x/scale-b)/a;
  float y=(px.y/scale-d)/c;
  y=(atan(pow(E,y))-(PI/4.))*2.;
  d=PI/180.;
  float lat=y/d;
  float lng=x/d;
  return vec2(lng,lat);
}

float pixelDistance(vec2 from, vec2 to) {
 vec2 a1 = ProjectFlat(from);
 vec2 b1 = ProjectFlat(to);
 return distance(a1, b1);
}

vec2 customProject(vec2 lnglat) {
  float t = lnglat.x;
  float e = lnglat.y;
  float Sm = 180.0 / PI;
  float Tm = 6378137.0;
  float Rm = PI / 180.0;
  float r = 85.0511287798;
  e = max(min(r, e), -r);
  t *= Rm;
  e *= Rm;
  e = log(tan(PI / 4.0 + e / 2.0));
  return vec2(t * Tm, e * Tm);
}