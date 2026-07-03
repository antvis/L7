import type { Scene } from '@antv/l7';
import { LineLayer, PointLayer, PolygonLayer } from '@antv/l7';
import { DrawEvent, DrawLine, DrawPoint, DrawPolygon } from '@antv/l7-draw';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

const center: [number, number] = [120.210792, 30.246026];
const zoom = 22.35;

const points = [
  { id: 'A', lng: 120.210804, lat: 30.246034 },
  { id: 'B', lng: 120.210827, lat: 30.246046 },
  { id: 'C', lng: 120.210764, lat: 30.246014 },
];

const lineCoordinates: [number, number][] = [
  [120.210752, 30.24601],
  [120.210785, 30.246024],
  [120.210826, 30.246048],
  [120.210852, 30.246035],
];

const polygonCoordinates: [number, number][][] = [
  [
    [120.210752, 30.246004],
    [120.210854, 30.24601],
    [120.210842, 30.246066],
    [120.210744, 30.246056],
    [120.210752, 30.246004],
  ],
];

const lineData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: lineCoordinates,
      },
    },
  ],
};

const polygonData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: polygonCoordinates,
      },
    },
  ],
};

export const issue1578CoordinatePrecision: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center,
      zoom,
      pitch: 0,
      rotation: 0,
      interactive: true,
    },
  });

  addReferenceOverlay(scene, options.id as HTMLDivElement);
  addDrawValidation(scene, options.id as HTMLDivElement);

  const pointLayer = new PointLayer({})
    .source(points, {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    })
    .shape('circle')
    .size(14)
    .color('#ef4444')
    .style({
      opacity: 0.95,
      stroke: '#ffffff',
      strokeWidth: 0,
    });

  const lineLayer = new LineLayer({})
    .source(lineData)
    .shape('line')
    .size(5)
    .color('#f97316')
    .style({
      opacity: 0.95,
    });

  const polygonLayer = new PolygonLayer({})
    .source(polygonData)
    .shape('fill')
    .color('#22c55e')
    .style({
      opacity: 0.35,
    });

  const polygonOutlineLayer = new PolygonLayer({})
    .source(polygonData)
    .shape('line')
    .size(3)
    .color('#16a34a')
    .style({
      opacity: 0.95,
    });

  scene.addLayer(polygonLayer);
  scene.addLayer(polygonOutlineLayer);
  scene.addLayer(lineLayer);
  scene.addLayer(pointLayer);

  return scene;
};

function addReferenceOverlay(scene: Scene, container: HTMLDivElement) {
  const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  overlay.style.position = 'absolute';
  overlay.style.inset = '0';
  overlay.style.zIndex = '20';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.overflow = 'visible';
  overlay.style.pointerEvents = 'none';

  const legend = document.createElement('div');
  legend.style.position = 'absolute';
  legend.style.right = '10px';
  legend.style.bottom = '10px';
  legend.style.zIndex = '30';
  legend.style.padding = '7px 9px';
  legend.style.borderRadius = '6px';
  legend.style.background = 'rgb(15 23 42 / 0.86)';
  legend.style.color = '#e5e7eb';
  legend.style.fontSize = '12px';
  legend.style.lineHeight = '1.45';
  legend.innerHTML = 'blue = lngLatToContainer reference<br />red/orange/green = L7';

  container.appendChild(overlay);
  container.appendChild(legend);

  const updateReference = () => {
    const { width, height } = container.getBoundingClientRect();
    overlay.setAttribute('viewBox', `0 0 ${Math.max(1, width)} ${Math.max(1, height)}`);
    overlay.innerHTML = '';

    const project = (coordinate: [number, number]) => {
      const point = scene.lngLatToContainer(coordinate);
      return [point.x, point.y];
    };
    const toPoints = (coordinates: [number, number][]) =>
      coordinates.map((coordinate) => project(coordinate).join(',')).join(' ');

    const polygon = createSvgElement('polygon');
    polygon.setAttribute('points', toPoints(polygonCoordinates[0]));
    polygon.setAttribute('fill', 'rgb(37 99 235 / 0.18)');
    polygon.setAttribute('stroke', '#2563eb');
    polygon.setAttribute('stroke-width', '2.5');
    polygon.setAttribute('stroke-linejoin', 'round');
    overlay.appendChild(polygon);

    const line = createSvgElement('polyline');
    line.setAttribute('points', toPoints(lineCoordinates));
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', '#2563eb');
    line.setAttribute('stroke-width', '3');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('stroke-linejoin', 'round');
    overlay.appendChild(line);

    for (const point of points) {
      const [x, y] = project([point.lng, point.lat]);
      const vertical = createSvgElement('line');
      vertical.setAttribute('x1', `${x}`);
      vertical.setAttribute('y1', `${y - 10}`);
      vertical.setAttribute('x2', `${x}`);
      vertical.setAttribute('y2', `${y + 10}`);
      vertical.setAttribute('stroke', '#2563eb');
      vertical.setAttribute('stroke-width', '2');
      overlay.appendChild(vertical);

      const horizontal = createSvgElement('line');
      horizontal.setAttribute('x1', `${x - 10}`);
      horizontal.setAttribute('y1', `${y}`);
      horizontal.setAttribute('x2', `${x + 10}`);
      horizontal.setAttribute('y2', `${y}`);
      horizontal.setAttribute('stroke', '#2563eb');
      horizontal.setAttribute('stroke-width', '2');
      overlay.appendChild(horizontal);

      const dot = createSvgElement('circle');
      dot.setAttribute('cx', `${x}`);
      dot.setAttribute('cy', `${y}`);
      dot.setAttribute('r', '2.5');
      dot.setAttribute('fill', '#2563eb');
      overlay.appendChild(dot);
    }
  };

  updateReference();
  scene.on('mapchange', updateReference);
  window.addEventListener('resize', updateReference);
}

function addDrawValidation(scene: Scene, container: HTMLDivElement) {
  const panel = document.createElement('div');
  panel.style.position = 'absolute';
  panel.style.top = '72px';
  panel.style.right = '10px';
  panel.style.zIndex = '30';
  panel.style.width = '250px';
  panel.style.padding = '10px';
  panel.style.borderRadius = '6px';
  panel.style.background = 'rgb(15 23 42 / 0.88)';
  panel.style.color = '#e5e7eb';
  panel.style.fontFamily = 'sans-serif';
  panel.style.fontSize = '12px';
  panel.style.lineHeight = '1.45';

  const status = document.createElement('div');
  status.style.marginTop = '8px';
  status.style.color = '#bfdbfe';

  const buttons = document.createElement('div');
  buttons.style.display = 'grid';
  buttons.style.gridTemplateColumns = 'repeat(4, 1fr)';
  buttons.style.gap = '6px';

  panel.appendChild(createPanelText('L7 Draw high-zoom check'));
  panel.appendChild(buttons);
  panel.appendChild(status);
  container.appendChild(panel);

  const clickMarker = document.createElement('div');
  clickMarker.style.position = 'absolute';
  clickMarker.style.zIndex = '25';
  clickMarker.style.width = '18px';
  clickMarker.style.height = '18px';
  clickMarker.style.marginLeft = '-9px';
  clickMarker.style.marginTop = '-9px';
  clickMarker.style.border = '2px solid #f8fafc';
  clickMarker.style.borderRadius = '50%';
  clickMarker.style.boxShadow = '0 0 0 2px rgb(15 23 42 / 0.85)';
  clickMarker.style.pointerEvents = 'none';
  clickMarker.style.display = 'none';
  container.appendChild(clickMarker);

  const drawPoint = new DrawPoint(scene, {
    style: {
      point: {
        normal: {
          color: '#ef4444',
          shape: 'circle',
          size: 12,
        },
        hover: {
          color: '#f97316',
          shape: 'circle',
          size: 14,
        },
        active: {
          color: '#f59e0b',
          shape: 'circle',
          size: 16,
        },
      },
    },
  });
  const drawLine = new DrawLine(scene, {
    distanceOptions: {
      format: (distance: number) => {
        if (distance < 1) {
          return `${(distance * 1000).toFixed(0)} m`;
        }
        return `${distance.toFixed(2)} km`;
      },
    },
  });
  const drawPolygon = new DrawPolygon(scene, {
    areaOptions: {
      format: (area: number) => `${area.toFixed(2)} km2`,
    },
  });
  const drawTools = [drawPoint, drawLine, drawPolygon];

  let activeMode = 'point';
  let lastClickPixel: { x: number; y: number } | null = null;
  let currentZoom = scene.getZoom();
  const counts = {
    point: 0,
    line: 0,
    polygon: 0,
  };

  const updateStatus = (message = 'Click the map to draw. White ring = last click.') => {
    status.innerHTML = [
      `<div>zoom: ${currentZoom.toFixed(3)}</div>`,
      `<div>mode: ${activeMode}</div>`,
      `<div>features: point ${counts.point}, line ${counts.line}, polygon ${counts.polygon}</div>`,
      `<div>${message}</div>`,
    ].join('');
  };

  const setMode = (mode: 'point' | 'line' | 'polygon') => {
    activeMode = mode;
    drawTools.forEach((tool) => tool.disable());
    if (mode === 'point') {
      drawPoint.enable();
    } else if (mode === 'line') {
      drawLine.enable();
    } else {
      drawPolygon.enable();
    }
    updateStatus();
  };

  const clearAll = () => {
    drawTools.forEach((tool) => tool.clear());
    counts.point = 0;
    counts.line = 0;
    counts.polygon = 0;
    clickMarker.style.display = 'none';
    updateStatus('Cleared. Click the map to draw again.');
  };

  buttons.appendChild(createButton('Point', () => setMode('point')));
  buttons.appendChild(createButton('Line', () => setMode('line')));
  buttons.appendChild(createButton('Polygon', () => setMode('polygon')));
  buttons.appendChild(createButton('Clear', clearAll));

  const recordClick = (event: MouseEvent) => {
    if (panel.contains(event.target as Node)) {
      return;
    }

    const rect = container.getBoundingClientRect();
    lastClickPixel = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    clickMarker.style.display = 'block';
    clickMarker.style.left = `${lastClickPixel.x}px`;
    clickMarker.style.top = `${lastClickPixel.y}px`;
  };
  container.addEventListener('click', recordClick, true);

  const updateZoom = () => {
    currentZoom = scene.getZoom();
    updateStatus();
  };
  scene.on('mapchange', updateZoom);
  scene.on('zoomChange', updateZoom);

  const destroyScene = scene.destroy.bind(scene);
  scene.destroy = () => {
    container.removeEventListener('click', recordClick, true);
    destroyScene();
  };

  const reportFeature = (feature: any, kind: 'point' | 'line' | 'polygon') => {
    const coordinate = getLastDrawCoordinate(feature);
    if (!coordinate || !lastClickPixel) {
      updateStatus(`${kind} added.`);
      return;
    }

    const projected = scene.lngLatToContainer(coordinate);
    const dx = projected.x - lastClickPixel.x;
    const dy = projected.y - lastClickPixel.y;
    updateStatus(`${kind} last vertex delta: dx ${dx.toFixed(2)} px, dy ${dy.toFixed(2)} px`);
  };

  drawPoint.on(DrawEvent.Change, (features: any[]) => {
    counts.point = features.length;
    updateStatus();
  });
  drawLine.on(DrawEvent.Change, (features: any[]) => {
    counts.line = features.length;
    updateStatus();
  });
  drawPolygon.on(DrawEvent.Change, (features: any[]) => {
    counts.polygon = features.length;
    updateStatus();
  });

  drawPoint.on(DrawEvent.Add, (feature: any) => reportFeature(feature, 'point'));
  drawLine.on(DrawEvent.Add, (feature: any) => reportFeature(feature, 'line'));
  drawPolygon.on(DrawEvent.Add, (feature: any) => reportFeature(feature, 'polygon'));

  setMode('point');
}

function getLastDrawCoordinate(feature: any): [number, number] | null {
  const geometry = feature?.geometry;
  if (!geometry) {
    return null;
  }

  if (geometry.type === 'Point') {
    return geometry.coordinates;
  }
  if (geometry.type === 'LineString') {
    return geometry.coordinates[geometry.coordinates.length - 1];
  }
  if (geometry.type === 'Polygon') {
    const ring = geometry.coordinates[0];
    return ring[Math.max(0, ring.length - 2)];
  }

  return null;
}

function createPanelText(text: string) {
  const title = document.createElement('div');
  title.textContent = text;
  title.style.marginBottom = '8px';
  title.style.fontWeight = '600';
  title.style.color = '#f8fafc';
  return title;
}

function createButton(text: string, onClick: () => void) {
  const button = document.createElement('button');
  button.textContent = text;
  button.style.height = '28px';
  button.style.border = '0';
  button.style.borderRadius = '4px';
  button.style.background = '#2563eb';
  button.style.color = '#ffffff';
  button.style.cursor = 'pointer';
  button.onclick = onClick;
  return button;
}

function createSvgElement<T extends keyof SVGElementTagNameMap>(tagName: T) {
  return document.createElementNS('http://www.w3.org/2000/svg', tagName);
}
