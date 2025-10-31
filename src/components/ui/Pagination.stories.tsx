import type { Meta, StoryObj } from '@storybook/react';
import { Pagination, PaginationContent, PaginationItem } from './pagination';

const meta: Meta = { title: 'UI/Pagination' };
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>1</PaginationItem>
        <PaginationItem>2</PaginationItem>
        <PaginationItem>3</PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

