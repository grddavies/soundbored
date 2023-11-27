import { Component, createSignal } from 'solid-js';
import { makeDoubleTapListener, makeDragHandler } from 'src/hooks';
import { Vec2 } from 'src/math';
import { GlobalState } from 'src/store/AppState';

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
  /**
   * Max parameter value
   */
  max: number;
  /**
   * Min parameter value (defaults to zero)
   */
  min?: number;
  /**
   * SVG size
   */
  size?: number;
  /**
   * Parameter value to return to by default
   */
  defaultValue: number;
  /**
   * Transform from a 2d pixel diff into the new parameter value
   */
  transform?: (dragDiff: Vec2) => number;
  label?: string;
};

/**
 * Renders an interactive knob component
 * @param props properties of this knob component
 * @returns
 */
export const Knob: Component<KnobProps> = (props) => {
  let svg: SVGSVGElement;

  const [dragStartVal, setDragStartVal] = createSignal(props.value);
  makeDragHandler({
    target: () => svg,
    onDragStart: () => {
      setDragStartVal(props.value);
    },
    onDragMove: (diff) => {
      props.updateFunc(
        Math.min(
          props.max,
          Math.max(
            props.min ?? 0,
            dragStartVal() + (props.transform ? props.transform(diff) : diff.y),
          ),
        ),
      );
    },
    onDragEnd: () => {
      if (dragStartVal() !== props.value) {
        GlobalState.persist();
      }
    },
  });

  // Reset the parameter and persist on double tap
  makeDoubleTapListener(
    () => svg,
    () => {
      if (props.value !== props.defaultValue) {
        props.updateFunc(props.defaultValue);
        GlobalState.persist();
      }
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
    </div>
  );
};
