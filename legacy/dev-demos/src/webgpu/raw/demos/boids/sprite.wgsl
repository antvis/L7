struct VertexOutput {
  @builtin(position) position : vec4<f32>,
  @location(4) color : vec4<f32>,
}

@vertex
fn vert_main(
  @location(0) a_particlePos : vec2<f32>,
  @location(1) a_particleVel : vec2<f32>,
  @location(2) a_pos : vec2<f32>
) -> VertexOutput {
  let angle = -atan2(a_particleVel.x, a_particleVel.y);
  let pos = vec2(
    (a_pos.x * cos(angle)) - (a_pos.y * sin(angle)),
    (a_pos.x * sin(angle)) + (a_pos.y * cos(angle))
  );
  
  var output : VertexOutput;
  output.position = vec4(pos + a_particlePos, 0.0, 1.0);
  output.color = vec4(
    1.0 - sin(angle + 1.0) - a_particleVel.y,
    pos.x * 100.0 - a_particleVel.y + 0.1,
    a_particleVel.x + cos(angle + 0.5),
    1.0);
  return output;
}

@fragment
fn frag_main(@location(4) color : vec4<f32>) -> @location(0) vec4<f32> {
  return color;
}