import { createPointerListeners } from '@solid-primitives/pointer';
import { Component, createSignal } from 'solid-js';

import { useObservable } from 'src/hooks';
import { useDoubleTap } from 'src/hooks/useDoubleTap';
import { Observable } from 'src/utils';
import { Knob } from './Knob';

type KnobWrapperProps = {
  value: Observable<number>;
  max: number;
  min?: number;
  size?: number;
  defaultValue: number;
  label?: string;
};

export const KnobWrapper: Component<KnobWrapperProps> = (props) => {
  let svg: SVGSVGElement;
  const SCALE = 4;
  const [value, setValue] = useObservable(props.value);

  const [initialVal, setInitialVal] = createSignal(props.value.value);
  const [dragging, setDragging] = createSignal(false);
  const [dragStartY, setDragStartY] = createSignal(0);

  const handleMove = (e: MouseEvent) => {
    console.log('MovePos ' + e.clientY);
    if (dragging()) {
      // Prevent scroll
      e.preventDefault();
      e.stopImmediatePropagation();
      setValue(
        Math.min(
          props.max,
          Math.max(
            props.min ?? 0,
            initialVal() +
              ((dragStartY() - e.clientY) / screen.availHeight) * SCALE,
          ),
        ),
      );
    }
  };
  const clearMoveHandler = () => {
    console.log('clearH');
    setDragging(false);
    window.removeEventListener('pointermove', handleMove);
    window.removeEventListener('pointerup', clearMoveHandler);
  };

  createPointerListeners({
    target: () => svg,
    onDown: (e) => {
      console.log('dragStart ' + e.clientY);
      setDragStartY(e.clientY);
      setInitialVal(value());
      setDragging(true);
      window.addEventListener('pointerup', clearMoveHandler, {
        passive: false,
      });
      window.addEventListener('pointermove', handleMove, { passive: false });
    },
  });

  useDoubleTap(
    () => svg,
    () => {
      setValue(props.defaultValue);
    },
  );

  return (
    <div>
      <div class="text-xs">{props.label}</div>
      <Knob
        ref={svg!}
        value={value()}
        min={props.min}
        max={props.max}
        size={props.size}
      />
    </div>
  );
};
