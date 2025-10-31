import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';

const meta: Meta = { title: 'UI/Popover' };
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Abrir</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">Conteúdo do popover</PopoverContent>
    </Popover>
  ),
};

