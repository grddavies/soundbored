import './Modal.css';

import { ParentComponent } from 'solid-js';

type ModalProps = {
  show: boolean;
  onClose: () => void;
  buttonText?: string;
};

export const Modal: ParentComponent<ModalProps> = (props) => {
  let modal: HTMLDivElement;
  let overlay: HTMLDivElement;
  return (
    <>
      <div ref={modal!} classList={{ modal: true, hidden: !props.show }}>
        <div class="topbar flex flex-row-reverse">
          <button onClick={props.onClose}>⨉</button>
        </div>
        <div class="modal-content p-2">{props.children}</div>
        {props.buttonText && (
          <button onClick={props.onClose}>{props.buttonText}</button>
        )}
      </div>
      <div
        ref={overlay!}
        classList={{ 'modal-overlay': true, hidden: !props.show }}
      />
    </>
  );
};
