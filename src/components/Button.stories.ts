import type { Meta, StoryFn } from '@storybook/html';
import Button, { ButtonProps } from './Button';

const meta: Meta<ButtonProps> = {
  title: 'Components/Button',
  parameters: {
    docs: {
      description: {
        component:
          'Keyboard: <kbd>Tab</kbd> to focus, <kbd>Space</kbd> or <kbd>Enter</kbd> to activate.\n' +
          'ARIA role: <code>button</code>. No focus trap.',
      },
    },
  },
};
export default meta;

const Template: StoryFn<ButtonProps> = (args) => Button(args);

export const Default = Template.bind({});
Default.args = { label: 'Click me' };
Default.parameters = {
  docs: {
    description: {
      story: 'Ensure the button has an accessible name via the `label` prop.',
    },
  },
};
