
precision highp float;
varying vec4 worldId;
void main() {
    if(worldId.x == 0. &&worldId.y == 0. && worldId.z==0.){
        discard;
        return;
    }
    gl_FragColor = worldId;
}