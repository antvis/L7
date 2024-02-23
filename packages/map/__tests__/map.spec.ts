import { Map } from '../src/map';
describe('Map', () => {
  const el = document.createElement('div');
  el.id = 'test-div-id';
  // el.style.width = '500px';
  // el.style.height = '500px';
  el.style.background = '#aaa';
  let map: Map;
  document.querySelector('body')?.appendChild(el);
  beforeEach(() => {
    map = new Map({
      container: el,
    });
  });
  it('should resize correctly', () => {
    // 创建Map的实例，将mock的Map传入


    map.resize();

    // 验证transform.resize方法是否被正确调用

  });
  it('Map set zoom', () => {
    map.setZoom(5);
    expect(map.getZoom()).toEqual(5);
    
  });
  it('Map set center', () => {
    map.setCenter([120,30])
    expect(map.getCenter()).toEqual({"lat": 30, "lng": 120});
  });
  it('Map set pitch', () => {
    map.setPitch(10)
    expect(map.getPitch()).toEqual(10);
  });
  it('Map set Bearing', () => {
    map.setBearing(10)
    expect(map.getBearing()).toEqual(10);
  });
  it('Map panTo ', () => {
    map.panTo([121,31],{animate: false})
    expect(map.getCenter()).toEqual({"lat": 31, "lng": 121});
  });
  it('Map panBy', () => {
    map.panBy([10,10],{animate: false})
    expect(map.getCenter().lng).toBeCloseTo(7.03,2);
  });
  it('Map zoomTo', () => {
    map.zoomTo(10,{animate: false})
    expect(map.getZoom()).toEqual(10);
  })
  it('Map zoomIn', () => {
    map.setZoom(9)
    map.zoomIn({animate: false})
    expect(map.getZoom()).toEqual(10);
  })
  it('Map zoomOut', () => {
    map.setZoom(10)
    map.zoomOut({animate: false})
    expect(map.getZoom()).toEqual(9);
  })
  it('Map setMaxZoom', () => {
    map.setMaxZoom(15)
    expect(map.getMaxZoom()).toEqual(15);
  })
  it('Map setMinZoom', () => {
    map.setMinZoom(5)
    expect(map.getMinZoom()).toEqual(5);
  })
  it('Map setMaxPitch', () => {
    map.setMaxPitch(60)
    expect(map.getMaxPitch()).toEqual(60);
  })
  it('Map setMinPitch', () => {
    map.setMinPitch(5)
    expect(map.getMinPitch()).toEqual(5);
  })
  // setPadding
  it('Map setPadding', () => {
    map.setPadding({
      top: 10,
      bottom: 10,
      left: 10,
      right: 10
    
    })
    expect(map.getPadding()).toEqual( {"bottom": 10, "left": 10, "right": 10, "top": 10});
  })
  // rotateTo
  it('Map rotateTo', () => {
    map.rotateTo(90)
    expect(map.getBearing()).toEqual(-0);
  })
  // resetNorth
  it('Map resetNorth', () => {
    map.resetNorth()
    expect(map.getBearing()).toEqual(-0);
  })
  // resetNorthPitch
  it('Map resetNorthPitch', () => {
    map.resetNorthPitch()
    expect(map.getPitch()).toEqual(0);
  })
  // fitBounds
  it('Map fitBounds', () => {
    map.fitBounds([[120,30],[121,31]],{animate: false})
    expect(map.getZoom()).toBeCloseTo(7.5,1);
  })
  // snapToNorth
  it('Map snapToNorth', () => {
    map.snapToNorth()
    expect(map.getBearing()).toEqual(-0);
  })
  //jumpTo
  it('Map jumpTo', () => {
    map.jumpTo({
      center: [120,30],
      zoom: 10,
      bearing: 90,
      pitch: 60
    },{
      animate: false
    })
    expect(map.getCenter()).toEqual({"lat": 30, "lng": 120});
    expect(map.getZoom()).toEqual(10);
    expect(map.getBearing()).toEqual(90);
    expect(map.getPitch()).toEqual(60);
  })
 
  
  // map getContainer
  it('Map getContainer', () => {
    expect(map.getContainer()).toEqual(el);
  })
  // getcanvas
  it('Map getCanvas', () => {
    expect(map.getCanvas()).toBeUndefined();
  })
  // project
  it('Map project', () => {
    expect(map.project([120,30]).x).toBeCloseTo(370.6,0);
    expect(map.project([120,30]).y).toBeCloseTo(105.2,1);
  })
  // unproject
  it('Map unproject', () => {
    expect(map.unproject([100,100]).lng).toBeCloseTo(-70.3,1);
    expect(map.unproject([100,100]).lat).toBeCloseTo(33.1,1);
  })
  // getbounds
  it('Map getBounds', () => {
    expect(map.getBounds().toArray()).toEqual( [
      [ -140.6250000000022, -71.96538769913126 ],
      [ 140.62499999999886, 71.96538769913161 ]
    ]);
  })
  // map remove
  it('Map remove', () => {
    map.remove()
    expect(map.getCanvasContainer()).toEqual(null);
  })
  // getMaxBounds
  it('Map getMaxBounds', () => {
    expect(map.getMaxBounds()).toEqual(null);
  })
  // // setMaxBounds
  it('Map setMaxBounds', () => {
    map.setMaxBounds([[120,30],[121,31]]);
    expect(map.getMaxBounds()?.toArray()).toEqual([[120, 30], [121, 31]]);
  })



});
