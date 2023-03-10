import { ParentComponent } from 'solid-js';

import style from './Modal.module.css';

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
      <div
        ref={modal!}
        classList={{ [style.modal]: true, hidden: !props.show }}
      >
        <div class={`${style.topbar} flex flex-row-reverse`}>
          <button onClick={props.onClose}>⨉</button>
        </div>
        <div class={`${style['modal-content']} p-2`}>{props.children}</div>
        {props.buttonText && (
          <button onClick={props.onClose}>{props.buttonText}</button>
        )}
      </div>
      <div
        ref={overlay!}
        classList={{ [style['modal-overlay']]: true, hidden: !props.show }}
      />
    </>
  );
};
