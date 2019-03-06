    vec4 id_topickColor(float pickingId) {
      float id = step(0.,pickingId) * pickingId;
      vec3 a = fract(vec3(1.0/255.0, 1.0/(255.0*255.0), 1.0/(255.0*255.0*255.0)) * id);
      a -= a.xxy * vec3(0.0, 1.0/255.0, 1.0/255.0);
      vec4 worldId = vec4(a,1);
      return worldId
    }