import { createPointerListeners } from '@solid-primitives/pointer';
import { Component, createSignal } from 'solid-js';
import { useDoubleTap } from 'src/hooks';

import CSS from './Knob.module.css';
import { SVGKnob } from './SVGKnob';

/**
 * Knob properties
 */
type KnobProps = {
  /**
   * The current value to display
   */
  value: number;
  /**
   * A function that updates the value
   * @param value
   * @returns
   */
  updateFunc: (value: number) => void;
  max: number;
  min?: number;
  size?: number;
  defaultValue: number;
  label?: string;
};

/**
 * Renders an interactive knob component
 * @param props properties of this knob component
 * @returns
 */
export const Knob: Component<KnobProps> = (props) => {
  let svg: SVGSVGElement;

  const [initialVal, setInitialVal] = createSignal(props.value);
  const [currentPointer, setCurrentPointer] = createSignal<number | null>(null);
  const [dragStartY, setDragStartY] = createSignal(0);
  const [precisionMode, setPrecisionMode] = createSignal(false);

  const handleMove = (e: PointerEvent): void => {
    if (e.pointerId === currentPointer()) {
      // Prevent scroll
      e.preventDefault();
      e.stopImmediatePropagation();

      // Precision adjustments
      if (e.pointerType === 'Mouse' && e.shiftKey) {
        setPrecisionMode(true);
      }

      props.updateFunc(
        Math.min(
          props.max,
          Math.max(
            props.min ?? 0,
            initialVal() +
              ((dragStartY() - e.clientY) / screen.availHeight) *
                (precisionMode() ? 1 : 4),
          ),
        ),
      );
    }
  };

  const clearMoveHandler = (e: PointerEvent): void => {
    if (e.pointerId === currentPointer()) {
      setCurrentPointer(null);
      setPrecisionMode(false);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', clearMoveHandler);
    }
  };

  createPointerListeners({
    target: () => svg,
    onDown: (e) => {
      setDragStartY(e.clientY);
      setInitialVal(props.value);
      setCurrentPointer(e.pointerId);
      window.addEventListener('pointerup', clearMoveHandler, {
        passive: false,
      });
      window.addEventListener('pointermove', handleMove, { passive: false });
    },
  });

  useDoubleTap(
    () => svg,
    () => {
      props.updateFunc(props.defaultValue);
    },
  );

  return (
    <div class="col">
      <div class={CSS['knob-label']}>{props.label}</div>
      <SVGKnob
        ref={svg!}
        value={props.value}
        min={props.min}
        max={props.max}
        size={props.size}
      />
    </div>
  );
};
