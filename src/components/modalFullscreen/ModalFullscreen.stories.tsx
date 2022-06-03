import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ModalFullscreen } from './ModalFullscreen';
import { useState } from 'react';
import { withDesign } from 'storybook-addon-designs';
import { Button } from 'components/button/Button';

export default {
  title: 'Components/Modal/Fullscreen',
  component: ModalFullscreen,
  decorators: [withDesign],
} as ComponentMeta<typeof ModalFullscreen>;

const Template: ComponentStory<typeof ModalFullscreen> = (args) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ModalFullscreen {...args} isOpen={isOpen} setIsOpen={setIsOpen}>
        <p>some content</p>
      </ModalFullscreen>
    </>
  );
};

export const Open = Template.bind({});
Open.args = {
  isOpen: true,
  setIsOpen: () => {},
  title: 'Modal title',
};

Open.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/fwADI9wqDrRAdlMX8EddCw/Bancor-v3?node-id=7879%3A257081',
  },
};
