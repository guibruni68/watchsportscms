import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './skeleton';

const meta: Meta<typeof Skeleton> = { title: 'UI/Skeleton', component: Skeleton };
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: () => (
    <div className="flex gap-4">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-6 w-48" />
    </div>
  ),
};

