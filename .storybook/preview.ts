// tslint:disable-next-line:no-submodule-imports
import { addParameters, configure } from '@storybook/react';
import { create } from '@storybook/theming';

addParameters({
  options: {
    isFullscreen: false,
    showAddonsPanel: false,
    showSearchBox: false,
    panelPosition: 'bottom',
    hierarchySeparator: /\./,
    // hierarchyRootSeparator: /\|/,
    enableShortcuts: true,
    theme: create({
      base: 'light',
      brandTitle: 'L7 for new architecture',
      brandUrl: 'https://github.com/antvis/L7',
      gridCellSize: 12,
    }),
  },
});

// automatically import all files ending in *.stories.tsx
const req = require.context('../stories', true, /\.stories\.tsx$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
