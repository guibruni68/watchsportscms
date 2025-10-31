import type { Meta, StoryObj } from '@storybook/react';
import LiveForm from './LiveForm';

const meta: Meta<typeof LiveForm> = {
  title: 'Forms/LiveForm',
  component: LiveForm,
};
export default meta;

type Story = StoryObj<typeof LiveForm>;

export const Default: Story = {
  args: {},
};

