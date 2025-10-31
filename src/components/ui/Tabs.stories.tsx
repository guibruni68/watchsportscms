import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const meta: Meta = {
  title: 'UI/Tabs',
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Conteúdo 1</TabsContent>
      <TabsContent value="tab2">Conteúdo 2</TabsContent>
    </Tabs>
  ),
};

