precision mediump float;
uniform sampler2D u_texture;
varying vec4 v_color;
uniform vec4 u_stroke;
uniform float u_strokeWidth;
uniform float u_buffer;
uniform float u_gamma;
uniform float u_opacity;
varying vec2 v_texcoord;
varying float v_size;
void main(){
    float dist=texture2D(u_texture,vec2(v_texcoord.x,v_texcoord.y)).a;
    float alpha;

    if(u_strokeWidth==0.){
        alpha=smoothstep(u_buffer-u_gamma,u_buffer+u_gamma,dist);
        gl_FragColor=vec4(v_color.rgb,alpha*v_color.a);
    }else{
        if(dist<=u_buffer-u_gamma){
            alpha=smoothstep(u_strokeWidth-u_gamma,u_strokeWidth+u_gamma,dist);
            gl_FragColor=vec4(u_stroke.rgb,alpha*u_stroke.a);
        }else if(dist<u_buffer){
            alpha=smoothstep(u_buffer-u_gamma,u_buffer+u_gamma,dist);
            gl_FragColor=vec4(alpha*v_color.rgb+(1.-alpha)*u_stroke.rgb,1.*v_color.a*alpha+(1.-alpha)*u_stroke.a);
        }else{
            alpha=1.;
            gl_FragColor=vec4(v_color.rgb,alpha*v_color.a);
        }
        
    }
      #pragma include "pick"
}