import type { Meta, StoryObj } from '@storybook/html';
import { Button, ButtonProps } from './Button';

const meta: Meta<ButtonProps> = {
  title: 'Primitives/Button',
  render: (args) => Button(args),
  parameters: {
    docs: {
      description: {
        component: 'Basic button component',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<ButtonProps>;

export const Primary: Story = {
  args: { label: 'Click me' },
};
