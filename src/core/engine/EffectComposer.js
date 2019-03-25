import EffectComposer from './composer';

export default function(renderer, container) {
  const composer = new EffectComposer(renderer);

  const updateSize = function() {
    // TODO: Re-enable this when perf issues can be solved
    //
    // Rendering double the resolution of the screen can be really slow
    // var pixelRatio = window.devicePixelRatio;
    const pixelRatio = 1;

    composer.setSize(container.clientWidth * pixelRatio, container.clientHeight * pixelRatio);
  };

  window.addEventListener('resize', updateSize, false);
  updateSize();

  return composer;
}

