/* @flow */

import formatTree from './formatTree';
import formatTreeNode from './formatTreeNode';

jest.mock('./formatTreeNode', () => jest.fn(() => '<MockedComponent />'));

describe('formatTree', () => {
  it('should format the node as a root node', () => {
    const tree = {};
    const options = {};

    const result = formatTree(tree, options);

    expect(formatTreeNode).toHaveBeenCalledWith(tree, false, 0, options);

    expect(result).toBe('<MockedComponent />');
  });
});
