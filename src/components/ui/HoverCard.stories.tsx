import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';
import { Button } from './button';

const meta: Meta = { title: 'UI/HoverCard' };
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button>Passar o mouse</Button>
      </HoverCardTrigger>
      <HoverCardContent>Conteúdo do hover</HoverCardContent>
    </HoverCard>
  ),
};

