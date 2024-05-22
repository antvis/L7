import { Cascader } from 'antd';
import 'antd/dist/reset.css';
import React, { useEffect, useRef, useState } from 'react';
import { TestCases } from './demos_next';

import GUI from 'lil-gui';
import { DEFAULT_GUI_OPTIONS, MAP_TYPES, SEARCH_PARAMS_KEYS } from './constants';
import type { GUIOptions } from './types';

const DEMO_LIST = Array.from(TestCases).map(([namespace, cases]) => {
  return {
    label: namespace,
    value: namespace,
    children: cases.map(([name]) => ({ label: name, value: name })),
  };
});

const inintGuiOptions = getParamsFromUrlPath();

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
    guiRef.current = new GUI();
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
    if (!TestCase || !guiRef.current) return;

    const extendGUIController = TestCase.extendGUI?.(guiRef.current) || [];
    const scene = TestCase({ ...guiOptions, id: mapContainer.current! });

    syncParamsToURLPath({ namespace, name, ...guiOptions });

    return () => {
      scene.then((s) => s.destroy());
      extendGUIController.forEach((d) => d.destroy());
    };
  }, [viewDemo, guiOptions]);

  const onDemoViewChange = (value: string[]) => {
    setViewDemo(value as [string, string]);
  };

  return (
    <>
      <div style={{ position: 'absolute', left: '20px', zIndex: 10, top: '20px' }}>
        <Cascader
          size="large"
          defaultValue={viewDemo}
          options={DEMO_LIST}
          onChange={onDemoViewChange}
        />
      </div>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </>
  );
};

function getParamsFromUrlPath() {
  const guiOptions = {
    ...DEFAULT_GUI_OPTIONS,
  };
  const searchParams = new URLSearchParams(window.location.search);

  SEARCH_PARAMS_KEYS.forEach((key) => {
    const value = searchParams.get(key);
    if (!value) return;
    if (key === 'animate') guiOptions[key] = value === 'true';
    else guiOptions[key] = value;
  });

  return guiOptions;
}

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
