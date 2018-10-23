precision mediump float;
uniform sampler2D u_texture;
uniform vec4 u_color;
uniform vec4 u_stroke;
uniform float u_strokeWidth;
uniform float u_buffer;
uniform float u_gamma;

varying vec2 v_texcoord;

void main() {

    float dist = texture2D(u_texture, v_texcoord).r;
    float alpha;
    if(u_strokeWidth == 0.0){
            alpha = smoothstep(u_buffer - u_gamma, u_buffer, dist);
            gl_FragColor = vec4(u_color.rgb, alpha * u_color.a);

    }else{

        if(dist <= u_buffer - u_gamma){

            alpha = smoothstep(u_strokeWidth - u_gamma, u_strokeWidth, dist);
            gl_FragColor = vec4(u_stroke.rgb, alpha * u_stroke.a);
        }else if(dist < u_buffer){
            alpha = smoothstep(u_buffer - u_gamma, u_buffer, dist);
            gl_FragColor = vec4(alpha * u_color.rgb + (1.0 - alpha) * u_stroke.rgb, 1.0 * u_color.a * alpha + (1.0 - alpha) * u_stroke.a);
        }else{
            alpha = 1.0;
            gl_FragColor = vec4(u_color.rgb, alpha * u_color.a);
        }
        
    }
}