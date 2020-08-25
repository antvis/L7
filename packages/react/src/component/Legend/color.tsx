import * as React from 'react';
interface IColorLegendProps {
  items?: any[];
  title: string;
  className?: string;
  style?: React.CSSProperties;
}
import './style.css';
export const ColorComponent = React.memo((props: IColorLegendProps) => {
  const { className, style, title } = props;
  const items = [
    { title: '1', color: 'rgb(239,243,255)' },
    { title: '10', color: 'rgb(198,219,239)' },
    { title: '30', color: 'rgb(158,202,225)' },
    { title: '50', color: 'rgb(107,174,214)' },
    { title: '60', color: 'rgb(49,130,189)' },
    { title: '100', color: 'rgb(8,81,156)' },
  ];

  return (
    <div>
      <div>
        {items.map((c, i) => {
          return (
            <div
              key={i.toString()}
              style={{
                background: c.color,
                height: '100%',
                display: 'inline-block',
                cursor: 'pointer',
                width: '' + (100.0 - items.length) / items.length + '%',
                marginRight: '1%',
                padding: 5,
              }}
            />
          );
        })}
      </div>
      <div>
        {items.map((c, i) => {
          return (
            <div
              key={i.toString() + '122'}
              style={{
                background: '#fff',
                height: '100%',
                display: 'inline-block',
                textAlign: 'left',
                cursor: 'pointer',
                width: '' + (100.0 - items.length) / items.length + '%',
                marginRight: '1%',
              }}
            >
              {c.title}
            </div>
          );
        })}
      </div>
    </div>
  );
});
