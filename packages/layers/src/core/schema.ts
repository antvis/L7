/**
 * BaseLayer Schema
 */
export default {
  properties: {
    enablePicking: {
      type: 'boolean',
    },
    enableHighlight: {
      type: 'boolean',
    },
    highlightColor: {
      oneOf: [
        {
          type: 'array',
          items: {
            type: 'number',
            minimum: 0,
            maximum: 1,
          },
        },
        {
          type: 'string',
        },
      ],
    },
  },
};
