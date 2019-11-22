/* @flow */

import formatReactFragmentNode from './formatReactFragmentNode';

const defaultOptions = {
  filterProps: [],
  showDefaultProps: true,
  showFunctions: false,
  tabStop: 2,
  useBooleanShorthandSyntax: true,
  useFragmentShortSyntax: true,
  sortProps: true,
};

describe('formatReactFragmentNode', () => {
  it('should format a react fragment with a string as children', () => {
    const tree = {
      type: 'ReactFragment',
      childrens: [
        {
          value: 'Hello world',
          type: 'string',
        },
      ],
    };

    expect(formatReactFragmentNode(tree, false, 0, defaultOptions)).toEqual(
      `<>
  Hello world
</>`
    );
  });

  it('should format a react fragment with a key', () => {
    const tree = {
      type: 'ReactFragment',
      key: 'foo',
      childrens: [
        {
          value: 'Hello world',
          type: 'string',
        },
      ],
    };

    expect(formatReactFragmentNode(tree, false, 0, defaultOptions)).toEqual(
      `<React.Fragment key="foo">
  Hello world
</React.Fragment>`
    );
  });

  it('should format a react fragment with multiple childrens', () => {
    const tree = {
      type: 'ReactFragment',
      childrens: [
        {
          type: 'ReactElement',
          displayName: 'div',
          props: { a: 'foo' },
          childrens: [],
        },
        {
          type: 'ReactElement',
          displayName: 'div',
          props: { b: 'bar' },
          childrens: [],
        },
      ],
    };

    expect(formatReactFragmentNode(tree, false, 0, defaultOptions)).toEqual(
      `<>
  <div a="foo" />
  <div b="bar" />
</>`
    );
  });

  it('should format an empty react fragment', () => {
    const tree = {
      type: 'ReactFragment',
      childrens: [],
    };

    expect(formatReactFragmentNode(tree, false, 0, defaultOptions)).toEqual(
      '<React.Fragment />'
    );
  });

  it('should format an empty react fragment with key', () => {
    const tree = {
      type: 'ReactFragment',
      key: 'foo',
      childrens: [],
    };

    expect(formatReactFragmentNode(tree, false, 0, defaultOptions)).toEqual(
      '<React.Fragment key="foo" />'
    );
  });

  it('should format a react fragment using the explicit syntax', () => {
    const tree = {
      type: 'ReactFragment',
      childrens: [
        {
          value: 'Hello world',
          type: 'string',
        },
      ],
    };

    expect(
      formatReactFragmentNode(tree, false, 0, {
        ...defaultOptions,
        ...{ useFragmentShortSyntax: false },
      })
    ).toEqual(
      `<React.Fragment>
  Hello world
</React.Fragment>`
    );
  });
});
