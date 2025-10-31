import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

const meta: Meta = { title: 'UI/Table' };
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ana</TableCell>
          <TableCell>ana@example.com</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

