import { ParentComponent } from 'solid-js';
import './Modal.css';

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
      <section ref={modal!} classList={{ modal: true, hidden: !props.show }}>
        <div class="topbar flex flex-row-reverse">
          <button onClick={props.onClose}>⨉</button>
        </div>
        <div>{props.children}</div>
        {props.buttonText && (
          <button onClick={props.onClose}>{props.buttonText}</button>
        )}
      </section>
      <div
        ref={overlay!}
        classList={{ 'modal-overlay': true, hidden: !props.show }}
      />
    </>
  );
};
