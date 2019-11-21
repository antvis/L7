/* @flow */

import formatProp from './formatProp';
import formatPropValue from './formatPropValue';

jest.mock('./formatPropValue');

const defaultOptions = {
  useBooleanShorthandSyntax: true,
  tabStop: 2,
};

describe('formatProp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should format prop with only a value', () => {
    formatPropValue.mockReturnValue('"MockedPropValue"');

    expect(
      formatProp('foo', true, 'bar', false, null, true, 0, defaultOptions)
    ).toEqual({
      attributeFormattedInline: ' foo="MockedPropValue"',
      attributeFormattedMultiline: `
  foo="MockedPropValue"`,
      isMultilineAttribute: false,
    });

    expect(formatPropValue).toHaveBeenCalledWith(
      'bar',
      true,
      0,
      defaultOptions
    );
  });

  it('should format prop with only a default value', () => {
    formatPropValue.mockReturnValue('"MockedPropValue"');

    expect(
      formatProp('foo', false, null, true, 'baz', true, 0, defaultOptions)
    ).toEqual({
      attributeFormattedInline: ' foo="MockedPropValue"',
      attributeFormattedMultiline: `
  foo="MockedPropValue"`,
      isMultilineAttribute: false,
    });

    expect(formatPropValue).toHaveBeenCalledWith(
      'baz',
      true,
      0,
      defaultOptions
    );
  });

  it('should format prop with a value and a default value', () => {
    formatPropValue.mockReturnValue('"MockedPropValue"');

    expect(
      formatProp('foo', true, 'bar', true, 'baz', true, 0, defaultOptions)
    ).toEqual({
      attributeFormattedInline: ' foo="MockedPropValue"',
      attributeFormattedMultiline: `
  foo="MockedPropValue"`,
      isMultilineAttribute: false,
    });

    expect(formatPropValue).toHaveBeenCalledWith(
      'bar',
      true,
      0,
      defaultOptions
    );
  });

  it('should format a truthy boolean prop (with short syntax)', () => {
    const options = {
      useBooleanShorthandSyntax: true,
      tabStop: 2,
    };

    formatPropValue.mockReturnValue('{true}');

    expect(
      formatProp('foo', true, true, false, false, true, 0, options)
    ).toEqual({
      attributeFormattedInline: ' foo',
      attributeFormattedMultiline: `
  foo`,
      isMultilineAttribute: false,
    });

    expect(formatPropValue).toHaveBeenCalledWith(true, true, 0, options);
  });

  it('should ignore a falsy boolean prop (with short syntax)', () => {
    const options = {
      useBooleanShorthandSyntax: true,
      tabStop: 2,
    };

    formatPropValue.mockReturnValue('{false}');

    expect(
      formatProp('foo', true, false, false, null, true, 0, options)
    ).toEqual({
      attributeFormattedInline: '',
      attributeFormattedMultiline: '',
      isMultilineAttribute: false,
    });

    expect(formatPropValue).toHaveBeenCalledWith(false, true, 0, options);
  });

  it('should format a truthy boolean prop (with explicit syntax)', () => {
    const options = {
      useBooleanShorthandSyntax: false,
      tabStop: 2,
    };

    formatPropValue.mockReturnValue('{true}');

    expect(
      formatProp('foo', true, true, false, false, true, 0, options)
    ).toEqual({
      attributeFormattedInline: ' foo={true}',
      attributeFormattedMultiline: `
  foo={true}`,
      isMultilineAttribute: false,
    });

    expect(formatPropValue).toHaveBeenCalledWith(true, true, 0, options);
  });

  it('should format a falsy boolean prop (with explicit syntax)', () => {
    const options = {
      useBooleanShorthandSyntax: false,
      tabStop: 2,
    };

    formatPropValue.mockReturnValue('{false}');

    expect(
      formatProp('foo', true, false, false, false, true, 0, options)
    ).toEqual({
      attributeFormattedInline: ' foo={false}',
      attributeFormattedMultiline: `
  foo={false}`,
      isMultilineAttribute: false,
    });

    expect(formatPropValue).toHaveBeenCalledWith(false, true, 0, options);
  });

  it('should format a mulitline props', () => {
    formatPropValue.mockReturnValue(`{[
"a",
"b"
]}`);

    expect(
      formatProp(
        'foo',
        true,
        ['a', 'b'],
        false,
        false,
        false,
        0,
        defaultOptions
      )
    ).toEqual({
      attributeFormattedInline: ` foo={[
"a",
"b"
]}`,
      attributeFormattedMultiline: `
  foo={[
"a",
"b"
]}`,
      isMultilineAttribute: true,
    });

    expect(formatPropValue).toHaveBeenCalledWith(
      ['a', 'b'],
      false,
      0,
      defaultOptions
    );
  });

  it('should indent the formatted string', () => {
    /*
     * lvl 4 and tabStop 2 :
     *  - 4 * 2 = 8 spaces
     *  - One new indentation = 2 spaces
     *  - Expected indentation : 10 spaces
     */

    const options = {
      useBooleanShorthandSyntax: true,
      tabStop: 2,
    };

    formatPropValue.mockReturnValue('"MockedPropValue"');

    expect(
      formatProp('foo', true, 'bar', false, null, true, 4, options)
    ).toEqual({
      attributeFormattedInline: ' foo="MockedPropValue"',
      attributeFormattedMultiline: `
          foo="MockedPropValue"`, // 10 spaces
      isMultilineAttribute: false,
    });

    expect(formatPropValue).toHaveBeenCalledWith('bar', true, 4, options);
  });
});
