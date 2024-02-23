import type HandlerManager from '../../src/handler/handler_manager';
import ScrollZoomHandler from '../../src/handler/scroll_zoom';
import { Map } from '../../src/map';
import Point from '../../src/geo/point';

describe('Map', () => {
  const el = document.createElement('div');
  el.id = 'test-div-id';
  // el.style.width = '500px';
  // el.style.height = '500px';
  el.style.background = '#aaa';
  let map: Map;
  let handlerManager: HandlerManager
  let scrollZoomHandler: ScrollZoomHandler
  document.querySelector('body')?.appendChild(el);
  beforeEach(() => {
    map = new Map({
      container: el,
      zoom: 10,
    });
    handlerManager = map.handlers;
    // @ts-ignore
    scrollZoomHandler = handlerManager.handlersById['scrollZoom'];
  
  });


  //  handlerManager isactive
    it('handlerManager is active', () => {
        expect(handlerManager.isActive()).toEqual(false);
    });

  it('scrollZoomHandler', () => {
    expect(scrollZoomHandler).toBeInstanceOf(ScrollZoomHandler);
  });
  it('boxZoomHandler box select', () => {
    // @ts-ignore
    const boxZoom = handlerManager.handlersById['boxZoom'];
    boxZoom.disable();
    boxZoom.enable();
  
    // 模拟鼠标按下事件
    let e = new MouseEvent('mousedown', {
        shiftKey: true,
        button: 0,
        clientX: 100, clientY: 100});
    // 创建一个 Point 对象
    const point1 = new Point(0,0);
    //@ts-ignore
    boxZoom.mousedown(e, point1);
  
    // 模拟鼠标移动事件
    const point2 = new Point(200,200);
    e = new MouseEvent('mousemove', {clientX: 200, clientY: 200});
    //@ts-ignore
    boxZoom.mousemoveWindow(e,point2);
  
    // 模拟鼠标释放事件
    const point3 = new Point(200,200);
    e = new MouseEvent('mouseup', {clientX: 200, clientY: 200});
    //@ts-ignore
    boxZoom.mouseupWindow(e,point3);
    expect(map.getZoom()).toEqual(10);


  
    // 验证结果
    // 这将取决于你的boxZoomHandler如何处理这些事件
    // 例如，你可能会检查地图的缩放级别或视口是否已经改变
  });
  // wheel
    it('scrollZoomHandler wheel', () => {
        const e = new WheelEvent('wheel', {deltaY: -500});
        scrollZoomHandler.wheel(e);
        scrollZoomHandler.renderFrame();
        expect(map.getZoom()).toEqual(10);
    });

   // disable
    it('scrollZoomHandler disable', () => {
     scrollZoomHandler.disable();
     expect(scrollZoomHandler.isEnabled()).toEqual(false);
    });
});