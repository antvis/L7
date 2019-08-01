#ifdef PICK
  if(worldId.x == 0. &&worldId.y == 0. && worldId.z==0.){
        discard;
        return;
    }
    gl_FragColor = worldId;
    return;
#endif