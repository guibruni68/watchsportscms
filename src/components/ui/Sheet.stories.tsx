import type { Meta, StoryObj } from '@storybook/react';
import { Sheet, SheetContent, SheetTrigger } from './sheet';
import { Button } from './button';

const meta: Meta = { title: 'UI/Sheet' };
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Abrir</Button>
      </SheetTrigger>
      <SheetContent side="right">Conteúdo do sheet</SheetContent>
    </Sheet>
  ),
};

