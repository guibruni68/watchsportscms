import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: 'Conteúdo do Card',
  },
};

