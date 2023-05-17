import { createPointerListeners } from '@solid-primitives/pointer';
import { Component, createSignal } from 'solid-js';
import { useDoubleTap } from 'src/hooks';
import { Vec2 } from 'src/math';
import { persistGlobalState } from 'src/store/AppState';

import style from './Knob.module.css';
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
  scaleFunc: (x: number) => number;
  label?: string;
};

/**
 * Handles Drag Events
 */
class DragHandler {
  private _dragStart: Vec2 = { x: -Infinity, y: -Infinity };
  private _activeDrag: number | undefined = undefined;

  private handleDrag(e: PointerEvent): void {
    // Apply some onDrag cb
    console.log({
      x: this._dragStart.x - e.clientX,
      y: this._dragStart.y - e.clientY,
    });
  }

  private clearDragHandler(e: PointerEvent): void {
    if (e.pointerId === this._activeDrag) {
      // apply some onDragEnd
      this._activeDrag = undefined;
      window.removeEventListener('pointermove', this.handleDrag);
      window.removeEventListener('pointerup', this.clearDragHandler);
    }
  }

  private onPointerDown(e: PointerEvent): void {
    this._dragStart = { x: e.clientX, y: e.clientY };
    this._activeDrag = e.pointerId;
    // onDragStart
    window.addEventListener('pointermove', this.handleDrag, { passive: false });
    window.addEventListener('pointerup', this.clearDragHandler, {
      passive: false,
    });
  }
}

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
              // TODO: work out how to do an exponential scale increasing and decreasing
              // Look up precision inputs
              props.scaleFunc((dragStartY() - e.clientY) / screen.availHeight),
          ),
        ),
      );
    }
  };

  const clearMoveHandler = (e: PointerEvent): void => {
    if (e.pointerId === currentPointer()) {
      // NOTE: We may not always want to persist
      // Could be abstracted into some kinda 'afterDrag or DragEnd'
      persistGlobalState();
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
      persistGlobalState();
    },
  );

  return (
    <div class="flex flex-column">
      <div class={style['knob-label']}>{props.label}</div>
      <SVGKnob
        ref={svg!}
        value={props.value}
        min={props.min}
        max={props.max}
        size={props.size}
      />
      <input hidden />
    </div>
  );
};
