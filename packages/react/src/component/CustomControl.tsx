import { Control, PositionName, Scene } from '@antv/l7';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { useSceneValue } from './SceneContext';
const { useEffect, useState } = React;

interface IColorLegendProps {
  position: PositionName;
  className?: string;
  style?: React.CSSProperties;
  children?: JSX.Element | JSX.Element[] | Array<JSX.Element | undefined>;
}

export default function CustoonConrol(props: IColorLegendProps) {
  const { className, style, children, position } = props;
  const mapScene = (useSceneValue() as unknown) as Scene;
  const el = document.createElement('div');
  useEffect(() => {
    const custom = new Control({
      position,
    });
    custom.onAdd = () => {
      if (className) {
        el.className = className;
      }
      if (style) {
        const cssText = Object.keys(style)
          .map((key: string) => {
            // @ts-ignore
            return `${key}:${style[key]}`;
          })
          .join(';');
        el.style.cssText = cssText;
      }

      return el;
    };
    mapScene.addControl(custom);
    return () => {
      mapScene.removeControl(custom);
    };
  }, []);
  return createPortal(children, el);
}
