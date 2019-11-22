/* @flow */

import React, { Fragment } from 'react';
import parseReactElement from './parseReactElement';

const options = {};

describe('parseReactElement', () => {
  it('should parse a react element with a string as children', () => {
    expect(parseReactElement(<h1>Hello world</h1>, options)).toEqual({
      type: 'ReactElement',
      displayName: 'h1',
      defaultProps: {},
      props: {},
      childrens: [
        {
          type: 'string',
          value: 'Hello world',
        },
      ],
    });
  });

  it('should filter empty childrens', () => {
    expect(
      parseReactElement(
        <h1>
          Hello
          {null}
          {true}
          {false}
          {''}
          world
        </h1>,
        options
      )
    ).toEqual({
      type: 'ReactElement',
      displayName: 'h1',
      defaultProps: {},
      props: {},
      childrens: [
        {
          type: 'string',
          value: 'Hello',
        },
        {
          type: 'string',
          value: 'world',
        },
      ],
    });
  });

  it('should parse a single depth react element', () => {
    expect(parseReactElement(<aaa foo="41" />, options)).toEqual({
      type: 'ReactElement',
      displayName: 'aaa',
      props: {
        foo: '41',
      },
      defaultProps: {},
      childrens: [],
    });
  });

  it('should parse a react element with an object as props', () => {
    expect(
      parseReactElement(<div a={{ aa: '1', bb: { cc: '3' } }} />, options)
    ).toEqual({
      type: 'ReactElement',
      displayName: 'div',
      defaultProps: {},
      props: {
        a: { aa: '1', bb: { cc: '3' } },
      },
      childrens: [],
    });
  });

  it('should parse a react element with another react element as props', () => {
    expect(parseReactElement(<div a={<span b="42" />} />, options)).toEqual({
      type: 'ReactElement',
      displayName: 'div',
      defaultProps: {},
      props: {
        a: <span b="42" />,
      },
      childrens: [],
    });
  });

  it('should parse the react element defaultProps', () => {
    const Foo = () => {};
    Foo.defaultProps = {
      bar: 'Hello Bar!',
      baz: 'Hello Baz!',
    };

    expect(
      parseReactElement(<Foo foo="Hello Foo!" bar="Hello world!" />, options)
    ).toEqual({
      type: 'ReactElement',
      displayName: 'Foo',
      defaultProps: {
        bar: 'Hello Bar!',
        baz: 'Hello Baz!',
      },
      props: {
        bar: 'Hello world!',
        baz: 'Hello Baz!',
        foo: 'Hello Foo!',
      },
      childrens: [],
    });
  });

  it('should extract the component key', () => {
    expect(parseReactElement(<div key="foo-1" />, options)).toEqual({
      type: 'ReactElement',
      displayName: 'div',
      defaultProps: {},
      props: {
        key: 'foo-1',
      },
      childrens: [],
    });
  });

  it('should extract the component ref', () => {
    const refFn = () => 'foo';

    expect(parseReactElement(<div ref={refFn} />, options)).toEqual({
      type: 'ReactElement',
      displayName: 'div',
      defaultProps: {},
      props: {
        ref: refFn,
      },
      childrens: [],
    });

    // eslint-disable-next-line react/no-string-refs
    expect(parseReactElement(<div ref="foo" />, options)).toEqual({
      type: 'ReactElement',
      displayName: 'div',
      defaultProps: {},
      props: {
        ref: 'foo',
      },
      childrens: [],
    });
  });

  it('should parse a react fragment', () => {
    expect(
      parseReactElement(
        <Fragment key="foo">
          <div />
          <div />
        </Fragment>,
        options
      )
    ).toEqual({
      type: 'ReactFragment',
      key: 'foo',
      childrens: [
        {
          type: 'ReactElement',
          displayName: 'div',
          defaultProps: {},
          props: {},
          childrens: [],
        },
        {
          type: 'ReactElement',
          displayName: 'div',
          defaultProps: {},
          props: {},
          childrens: [],
        },
      ],
    });
  });
});
