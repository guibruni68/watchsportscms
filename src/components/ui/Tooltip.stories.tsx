import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Button } from './button';

const meta: Meta = {
  title: 'UI/Tooltip',
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Hover</Button>
        </TooltipTrigger>
        <TooltipContent>Texto do tooltip</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

