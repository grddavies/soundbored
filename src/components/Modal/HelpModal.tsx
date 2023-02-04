import { Component, Setter } from 'solid-js';
import { AudioContextManager } from 'src/audio';

import { Modal } from './Modal';

type HelpModalProps = {
  show: boolean;
  setShow: Setter<boolean>;
};

/**
 * Toggleable help modal dialogue
 * @param props
 * @returns
 */
export const HelpModal: Component<HelpModalProps> = (props) => (
  <Modal
    show={props.show}
    onClose={() => {
      if (!AudioContextManager.initialized.value) {
        AudioContextManager.init();
      }
      props.setShow(false);
    }}
    buttonText="Ok"
  >
    <div class="grid">
      <div class="col">
        <h2 class="pb-2">SoundBored</h2>
        <div class="text-left">
          <div class="py-2">Trigger samples by hitting the pads</div>
          <div class="py-2">Load new sounds from the sample explorer</div>
          <div class="py-2">Record and upload your own samples</div>
        </div>
      </div>
    </div>
  </Modal>
);
