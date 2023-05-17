import { createPointerListeners } from '@solid-primitives/pointer';
import { Accessor, Component, onMount } from 'solid-js';
import { useDoubleTap } from 'src/hooks';
import { Vec2 } from 'src/math';
import { GlobalState } from 'src/store/AppState';
import { Logger } from 'src/utils/Logger';

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

type PointerEventHandler = (e: PointerEvent) => void;

/**
 * Abstract Drag Event Handler
 */
abstract class DragHandler {
  private _dragStart: Vec2 = { x: -Infinity, y: -Infinity };
  private _activeDrag: number | undefined = undefined;
  private _pos: Vec2 | undefined = undefined;

  private _onPointerDown = (e: PointerEvent): void => {
    this._dragStart = { x: e.clientX, y: e.clientY };
    this._pos = this._dragStart;
    this._activeDrag = e.pointerId;
    this.onDragStart?.(e);
    window.addEventListener('pointermove', this._onPointerMove, {
      passive: false,
    });
    window.addEventListener('pointerup', this._onPointerUp, {
      passive: false,
    });
  };

  private _onPointerMove = (e: PointerEvent): void => {
    if (e.pointerId === this._activeDrag) {
      this._pos = {
        x: this._dragStart.x - e.clientX,
        y: this._dragStart.y - e.clientY,
      };
      this.onDragMove?.(e);
    }
  };

  private _onPointerUp = (e: PointerEvent): void => {
    if (e.pointerId === this._activeDrag) {
      this._activeDrag = undefined;
      this._pos = undefined;
      window.removeEventListener('pointermove', this._onPointerMove);
      window.removeEventListener('pointerup', this._onPointerUp);
      this.onDragEnd?.(e);
    }
  };

  constructor(element: Element) {
    this.target = element;
    createPointerListeners({
      target: this.target,
      onDown: this._onPointerDown,
    });
  }

  public target: Element;

  public abstract onDragStart: PointerEventHandler | undefined;

  public abstract onDragMove: PointerEventHandler | undefined;

  public abstract onDragEnd: PointerEventHandler | undefined;

  public get position(): Vec2 | undefined {
    return this._activeDrag != null ? this._pos : undefined;
  }

  public get relPosition(): Vec2 | undefined {
    const absPos = this._pos;
    return absPos
      ? { x: absPos.x / screen.availWidth, y: absPos?.y / screen.availHeight }
      : undefined;
  }
}

class KnobDragHandler extends DragHandler {
  private updateFunc: (value: number) => void;

  private initialValue: number;

  private signal: Accessor<number>;

  private max: number;

  private min: number;

  constructor(
    element: Element,
    updateFunc: (value: number) => void,
    signal: () => number,
    opts: {
      min?: number;
      max: number;
    },
  ) {
    super(element);
    this.signal = signal;
    this.updateFunc = updateFunc;
    this.initialValue = signal();
    this.max = opts.max;
    this.min = opts.min ?? 0;
  }

  public onDragStart = (): void => {
    this.initialValue = this.signal();
  };

  public onDragMove = (): void => {
    if (this.relPosition) {
      this.updateFunc(
        Math.min(
          this.max,
          Math.max(this.min, this.initialValue + this.relPosition.y),
        ),
      );
    }
  };

  public onDragEnd = (): void => {
    Logger.debug('[DRAG][END]', this.position);
  };
}

/**
 * Renders an interactive knob component
 * @param props properties of this knob component
 * @returns
 */
export const Knob: Component<KnobProps> = (props) => {
  let svg: SVGSVGElement;

  onMount(() => {
    new KnobDragHandler(svg, props.updateFunc, () => props.value, {
      max: props.max,
      min: props.min ?? 0,
    });
  });

  useDoubleTap(
    () => svg,
    () => {
      props.updateFunc(props.defaultValue);
      GlobalState.persist();
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
      {/* TODO:Use input to handler value changes */}
      <input hidden />
    </div>
  );
};
