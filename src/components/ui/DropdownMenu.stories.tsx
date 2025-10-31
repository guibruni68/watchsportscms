import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { Button } from './button';

const meta: Meta = { title: 'UI/DropdownMenu' };
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Item 1</DropdownMenuItem>
        <DropdownMenuItem>Item 2</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

