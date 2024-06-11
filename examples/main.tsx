import type { Scene } from '@antv/l7-scene';
import { Cascader, ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import type { Controller } from 'lil-gui';
import GUI from 'lil-gui';
import React, { useEffect, useRef, useState } from 'react';
import { DEFAULT_GUI_OPTIONS, MAP_TYPES, SEARCH_PARAMS_KEYS } from './constants';
import { TestCases } from './demos';
import type { GUIOptions } from './types';

const DEMO_LIST = Array.from(TestCases).map(([namespace, cases]) => {
  return {
    label: namespace,
    value: namespace,
    children: cases.map(([name]) => ({ label: name, value: name })),
  };
});

const inintGuiOptions = getParamsFromUrlPath();
const isSnapshotMode = inintGuiOptions.snapshot;

export const Main = () => {
  const guiRef = useRef<GUI>();
  const mapContainer = useRef<HTMLDivElement>(null);
  const [guiOptions, setGuiOptions] = useState<GUIOptions>(inintGuiOptions);
  const [viewDemo, setViewDemo] = useState<[string, string]>(() => {
    const { namespace = 'point', name = 'fill' } = inintGuiOptions;
    return [namespace, name];
  });

  // GUI
  useEffect(() => {
    guiRef.current = new GUI({ title: 'Scene', autoPlace: !isSnapshotMode });
    const onChange = (v: Partial<GUIOptions>) => {
      setGuiOptions((pre) => ({ ...pre, ...v }));
    };
    guiRef.current
      .add(inintGuiOptions, 'map', MAP_TYPES)
      .onChange((map: GUIOptions['map']) => onChange({ map }));
    guiRef.current
      .add(inintGuiOptions, 'renderer', ['regl', 'device'])
      .onChange((renderer: GUIOptions['renderer']) => onChange({ renderer }));
    guiRef.current
      .add(inintGuiOptions, 'enableWebGPU')
      .onChange((enableWebGPU: GUIOptions['enableWebGPU']) => onChange({ enableWebGPU }));
    guiRef.current
      .add(inintGuiOptions, 'animate')
      .onChange((animate: GUIOptions['animate']) => onChange({ animate }));

    return () => {
      guiRef.current?.destroy();
    };
  }, []);

  // change TestCase
  useEffect(() => {
    const [namespace, name] = viewDemo;
    const TestCase = getDemoFromName(namespace, name);
    if (!TestCase) return;

    let scene: Scene;
    let extendGUI: Controller[] | GUI[] = [];

    const asyncFun = async () => {
      scene = await TestCase({ ...guiOptions, id: mapContainer.current! });
      if (TestCase.extendGUI) {
        extendGUI = TestCase.extendGUI?.(guiRef.current!);
      }

      // @ts-ignore
      if (isSnapshotMode && window.screenshot) {
        // @ts-ignore
        await window.screenshot();
      }
    };

    asyncFun();
    syncParamsToURLPath({ ...guiOptions, namespace, name });

    return () => {
      scene?.destroy();
      while (mapContainer.current?.firstChild) {
        mapContainer.current.removeChild(mapContainer.current.lastChild!);
      }
      try {
        extendGUI.forEach((d) => d.destroy());
      } catch (error) {
        console.warn('error: ', error);
      }
    };
  }, [viewDemo, guiOptions]);

  const onDemoViewChange = (value: string[]) => {
    setViewDemo(value as [string, string]);
  };

  return (
    <>
      {!isSnapshotMode && (
        <ConfigProvider theme={{ components: { Cascader: { dropdownHeight: 400 } } }}>
          <Cascader
            style={{ position: 'absolute', left: '20px', zIndex: 10, top: '20px' }}
            size="large"
            defaultValue={viewDemo}
            options={DEMO_LIST}
            onChange={onDemoViewChange}
          />
        </ConfigProvider>
      )}
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </>
  );
};

/**
 * get guiOptions(SEARCH_PARAMS_KEYS) from URL path
 * @returns
 */
function getParamsFromUrlPath() {
  const guiOptions = {
    ...DEFAULT_GUI_OPTIONS,
  };
  const searchParams = new URLSearchParams(window.location.search);

  SEARCH_PARAMS_KEYS.forEach((key) => {
    const value = searchParams.get(key);
    if (!value) return;
    if (['animate', 'snapshot', 'enableWebGPU'].includes(key)) guiOptions[key] = value === 'true';
    else guiOptions[key] = value;
  });

  return guiOptions;
}

/**
 * sync guiOptions(SEARCH_PARAMS_KEYS) to URL path
 */
function syncParamsToURLPath(guiOptions: GUIOptions) {
  const searchParams = new URLSearchParams(window.location.search);
  Object.entries(guiOptions).forEach(([key, value]) => {
    if (SEARCH_PARAMS_KEYS.includes(key as (typeof SEARCH_PARAMS_KEYS)[number])) {
      searchParams.set(key, value.toString());
    }
  });
  window.history.replaceState(null, '', `?${searchParams.toString()}`);
}

function getDemoFromName(namespace: string, name: string) {
  const demo = TestCases.get(namespace)?.find(([_name]) => _name === name)?.[1];
  return demo;
}
