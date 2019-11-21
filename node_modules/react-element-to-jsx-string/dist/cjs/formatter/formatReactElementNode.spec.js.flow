/* @flow */

import React from 'react';
import formatReactElementNode from './formatReactElementNode';

const defaultOptions = {
  filterProps: [],
  showDefaultProps: true,
  showFunctions: false,
  tabStop: 2,
  useBooleanShorthandSyntax: true,
  sortProps: true,
};

describe('formatReactElementNode', () => {
  it('should format a react element with a string a children', () => {
    const tree = {
      type: 'ReactElement',
      displayName: 'h1',
      defaultProps: {},
      props: {},
      childrens: [
        {
          value: 'Hello world',
          type: 'string',
        },
      ],
    };

    expect(formatReactElementNode(tree, false, 0, defaultOptions)).toEqual(
      `<h1>
  Hello world
</h1>`
    );
  });

  it('should format a single depth react element', () => {
    const tree = {
      type: 'ReactElement',
      displayName: 'aaa',
      props: {
        foo: '41',
      },
      defaultProps: {
        foo: '41',
      },
      childrens: [],
    };

    expect(formatReactElementNode(tree, false, 0, defaultOptions)).toEqual(
      '<aaa foo="41" />'
    );
  });

  it('should format a react element with an object as props', () => {
    const tree = {
      type: 'ReactElement',
      displayName: 'div',
      defaultProps: {
        a: { aa: '1', bb: { cc: '3' } },
      },
      props: {
        a: { aa: '1', bb: { cc: '3' } },
      },
      childrens: [],
    };

    expect(formatReactElementNode(tree, false, 0, defaultOptions)).toEqual(
      `<div
  a={{
    aa: '1',
    bb: {
      cc: '3'
    }
  }}
 />`
    );
  });

  it('should format a react element with another react element as props', () => {
    const tree = {
      type: 'ReactElement',
      displayName: 'div',
      defaultProps: {
        a: <span b="42" />,
      },
      props: {
        a: <span b="42" />,
      },
      childrens: [],
    };

    expect(formatReactElementNode(tree, false, 0, defaultOptions)).toEqual(
      '<div a={<span b="42" />} />'
    );
  });

  it('should format a react element with multiline children', () => {
    const tree = {
      type: 'ReactElement',
      displayName: 'div',
      defaultProps: {},
      props: {},
      childrens: [
        {
          type: 'string',
          value: 'first line\nsecond line\nthird line',
        },
      ],
    };

    expect(formatReactElementNode(tree, false, 0, defaultOptions)).toEqual(
      `<div>
  first line
  second line
  third line
</div>`
    );

    expect(formatReactElementNode(tree, false, 2, defaultOptions)).toEqual(
      `<div>
      first line
      second line
      third line
    </div>`
    );
  });
});
