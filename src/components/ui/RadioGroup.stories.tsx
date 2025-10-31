import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from './radio-group';

const meta: Meta = { title: 'UI/RadioGroup' };
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="1" id="r1" />
        <label htmlFor="r1">Opção 1</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="2" id="r2" />
        <label htmlFor="r2">Opção 2</label>
      </div>
    </RadioGroup>
  ),
};

