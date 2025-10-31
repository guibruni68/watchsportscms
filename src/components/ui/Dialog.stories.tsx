import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Button } from './button';

const meta: Meta = {
  title: 'UI/Dialog',
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Abrir diálogo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exemplo de diálogo</DialogTitle>
        </DialogHeader>
        Conteúdo do diálogo
      </DialogContent>
    </Dialog>
  ),
};

