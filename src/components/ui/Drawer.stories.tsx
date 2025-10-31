import type { Meta, StoryObj } from '@storybook/react';
import { Drawer, DrawerContent, DrawerTrigger } from './drawer';
import { Button } from './button';

const meta: Meta = { title: 'UI/Drawer' };
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Abrir</Button>
      </DrawerTrigger>
      <DrawerContent>Conteúdo do drawer</DrawerContent>
    </Drawer>
  ),
};

