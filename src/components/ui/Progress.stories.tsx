import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './progress';

const meta: Meta<typeof Progress> = { title: 'UI/Progress', component: Progress };
export default meta;

type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: { value: 45 },
};

