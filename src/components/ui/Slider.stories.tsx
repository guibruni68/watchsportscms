import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './slider';

const meta: Meta<typeof Slider> = { title: 'UI/Slider', component: Slider };
export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: { defaultValue: [50], max: 100, step: 1 },
};

