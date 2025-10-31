import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertDescription, AlertTitle } from './alert';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Sucesso</AlertTitle>
      <AlertDescription>Operação concluída.</AlertDescription>
    </Alert>
  ),
};

