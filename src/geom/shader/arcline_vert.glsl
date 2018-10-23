precision mediump float;
attribute vec4 a_color;
attribute vec4 a_instance;
uniform mat4 matModelViewProjection;
uniform float segmentNumber;  
varying vec3 v_color;

float getSegmentRatio(float index) {
    return smoothstep(0.0, 1.0, index / (segmentNumber - 1.0));
}

float paraboloid(vec2 source, vec2 target, float ratio) {
    vec2 x = mix(source, target, ratio);
    vec2 center = mix(source, target, 0.5);
    float dSourceCenter = distance(source, center);
    float dXCenter = distance(x, center);
    return (dSourceCenter + dXCenter) * (dSourceCenter - dXCenter)*0.6;
}

vec3 getPos(vec2 source, vec2 target, float height, float segmentRatio) {
    return vec3(
    mix(source, target, segmentRatio),
    sqrt(max(0.0, height))
    );
}

void main() {
    mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
    vec2 source = a_instance.rg;
    vec2 target = a_instance.ba;
    float segmentIndex = position.x;
    float segmentRatio = getSegmentRatio(segmentIndex);
    vec3 c1 = vec3(0.929,0.972,0.917);
    vec3 c2 = vec3(0.062,0.325,0.603); 
    v_color = mix(c1, c2, segmentRatio);
    float height = paraboloid(source, target, segmentRatio);
    vec3 position = getPos(source,target,height,segmentRatio);
    gl_Position = matModelViewProjection * vec4(position, 1.0);
}