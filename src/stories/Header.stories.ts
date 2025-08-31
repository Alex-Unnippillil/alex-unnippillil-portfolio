import type { Meta, StoryObj } from '@storybook/html';
import { Header, HeaderProps } from './Header';

const meta: Meta<HeaderProps> = {
  title: 'Primitives/Header',
  render: (args) => Header(args),
  parameters: {
    docs: {
      description: {
        component: 'Page heading',
      },
    },
  },
  argTypes: {
    text: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<HeaderProps>;

export const Basic: Story = {
  args: { text: 'Heading' },
};
