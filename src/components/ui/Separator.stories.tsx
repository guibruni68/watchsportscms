import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta: Meta<typeof Separator> = { title: 'UI/Separator', component: Separator };
export default meta;

type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  render: () => (
    <div>
      Conteúdo acima
      <Separator className="my-4" />
      Conteúdo abaixo
    </div>
  ),
};

