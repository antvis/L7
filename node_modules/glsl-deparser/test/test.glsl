precision highp int;
precision highp float;
precision highp vec2;
precision highp vec3;
precision highp vec4;
#line 0

#define X(a) Y \
  asdf \
  barry

struct xxx {
  int y;
  float b;
} a = 2, b;

struct {
  xxx z;
} www;
struct gary {
  vec4 busey;
};
varying vec2 vTexcoord;
varying vec3 vPosition;
uniform mat4 proj, view;
 
    attribute vec3 position;
    attribute vec2 texcoord;

int forwarddecl(vec2 c);

int forwarddecl(vec2 c) {

}

int empty() {

}
 
int two(int a, int b) {

}

int one(int a[2]) {
  do x; while(1);
}

int emptyname(vec2[4]);
int emptynameemptyname(vec2, vec2);


int first, second, third, fourth, fifth, sixth, seventh, eigth;

    void main(){
        vTexcoord = texcoord;
        vPosition = position;
        vec3 thing = vec2(1., 2.);
        int v_thing, garybusey;
        thing.rgba = 2e10 + .2e2 + 1.e3 * 0xFaBc09 + (3 * v_thing);

        for(xxx i = 0; i < 10; ++i) {
          discard;
        }
        while(1) {
          v_thing = 23;
        }
        gl_Position = proj * view * // nope
        vec4(position, 1.0);

        if(first <  y) { z; }
        if(second < y) z;
        if(third == y) z; else if(z == w) y;
        if(fourth == y) z; else if(z == w) { y; };
        if(fifth == y) z; else if(z == w) { y; } else a;
        if(sixth == y) z; else z;
        if(seventh == y) z; else {z; }
        if(eigth == y) { z; } else { z; }


        for(;;) garybusey;
        return x;
        return;
        break;
        continue;
    }

