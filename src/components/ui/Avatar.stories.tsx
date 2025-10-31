import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

const meta: Meta = { title: 'UI/Avatar' };
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/100" alt="avatar" />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

