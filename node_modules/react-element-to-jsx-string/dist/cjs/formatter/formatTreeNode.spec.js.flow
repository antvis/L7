/* @flow */

import formatTreeNode from './formatTreeNode';

jest.mock('./formatReactElementNode', () => () =>
  '<MockedFormatReactElementNodeResult />'
);

describe('formatTreeNode', () => {
  it('should format number tree node', () => {
    expect(formatTreeNode({ type: 'number', value: 42 }, true, 0, {})).toBe(
      '42'
    );
  });

  it('should format string tree node', () => {
    expect(formatTreeNode({ type: 'string', value: 'foo' }, true, 0, {})).toBe(
      'foo'
    );
  });

  it('should format react element tree node', () => {
    expect(
      formatTreeNode(
        {
          type: 'ReactElement',
          displayName: 'Foo',
        },
        true,
        0,
        {}
      )
    ).toBe('<MockedFormatReactElementNodeResult />');
  });

  const jsxDelimiters = ['<', '>', '{', '}'];
  jsxDelimiters.forEach(char => {
    it(`should escape string that contains the JSX delimiter "${char}"`, () => {
      expect(
        formatTreeNode(
          { type: 'string', value: `I contain ${char}, is will be escaped` },
          true,
          0,
          {}
        )
      ).toBe(`{\`I contain ${char}, is will be escaped\`}`);
    });
  });

  it('should preserve the format of string', () => {
    expect(formatTreeNode({ type: 'string', value: 'foo\nbar' }, true, 0, {}))
      .toBe(`foo
bar`);

    expect(
      formatTreeNode(
        {
          type: 'string',
          value: JSON.stringify({ foo: 'bar' }, null, 2),
        },
        false,
        0,
        {
          tabStop: 2,
        }
      )
    ).toBe(`{\`{
  "foo": "bar"
}\`}`);
  });
});
