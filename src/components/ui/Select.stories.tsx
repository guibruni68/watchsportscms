import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

const meta: Meta = {
  title: 'UI/Select',
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Selecione..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">Opção 1</SelectItem>
        <SelectItem value="2">Opção 2</SelectItem>
      </SelectContent>
    </Select>
  ),
};

