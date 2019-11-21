/* @flow */

import mergeSiblingPlainStringChildrenReducer from './mergeSiblingPlainStringChildrenReducer';
import {
  createNumberTreeNode,
  createStringTreeNode,
  createReactElementTreeNode,
} from './../tree';
import type { TreeNode } from './../tree';

test('mergeSiblingPlainStringChildrenReducer should merge sibling string tree nodes', () => {
  const childrens: TreeNode[] = [
    createStringTreeNode('a'),
    createStringTreeNode('b'),
    createStringTreeNode('c'),
  ];

  expect(childrens.reduce(mergeSiblingPlainStringChildrenReducer, [])).toEqual([
    {
      type: 'string',
      value: 'abc',
    },
  ]);
});

test('mergeSiblingPlainStringChildrenReducer should consider number as string', () => {
  expect(
    [
      createStringTreeNode('a'),
      createNumberTreeNode(51),
      createStringTreeNode('c'),
    ].reduce(mergeSiblingPlainStringChildrenReducer, [])
  ).toEqual([
    {
      type: 'string',
      value: 'a51c',
    },
  ]);

  expect(
    [
      createStringTreeNode(5),
      createNumberTreeNode(1),
      createStringTreeNode('a'),
    ].reduce(mergeSiblingPlainStringChildrenReducer, [])
  ).toEqual([
    {
      type: 'string',
      value: '51a',
    },
  ]);
});

test('mergeSiblingPlainStringChildrenReducer should detect non string node', () => {
  const childrens: TreeNode[] = [
    createReactElementTreeNode('MyFoo', {}, {}, ['foo']),
    createStringTreeNode('a'),
    createNumberTreeNode('b'),
    createReactElementTreeNode('MyBar', {}, {}, ['bar']),
    createStringTreeNode('c'),
    createNumberTreeNode(42),
    createReactElementTreeNode('MyBaz', {}, {}, ['baz']),
  ];

  expect(childrens.reduce(mergeSiblingPlainStringChildrenReducer, [])).toEqual([
    {
      type: 'ReactElement',
      displayName: 'MyFoo',
      props: {},
      defaultProps: {},
      childrens: ['foo'],
    },
    {
      type: 'string',
      value: 'ab',
    },
    {
      type: 'ReactElement',
      displayName: 'MyBar',
      props: {},
      defaultProps: {},
      childrens: ['bar'],
    },
    {
      type: 'string',
      value: 'c42',
    },
    {
      type: 'ReactElement',
      displayName: 'MyBaz',
      props: {},
      defaultProps: {},
      childrens: ['baz'],
    },
  ]);
});

test('mergeSiblingPlainStringChildrenReducer should reduce empty array to an empty array', () => {
  expect([].reduce(mergeSiblingPlainStringChildrenReducer, [])).toEqual([]);
});
