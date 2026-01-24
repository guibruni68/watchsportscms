import type { Preview } from '@storybook/react';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    actions: { argTypesRegex: '^on.*' },
    layout: 'centered',
      },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, width: '100%', maxWidth: 1200 }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;