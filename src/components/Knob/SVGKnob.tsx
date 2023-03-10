import { Component, Ref } from 'solid-js';
import { polarToCartesian, Vec2, Vec2Add } from 'src/math';

import style from './Knob.module.css';

/**
 * Parameters passed to the knob component
 */
type SVGKnobProps = {
  /**
   * The current value of the knob
   */
  value: number;
  /**
   * The maximum value of the knob
   */
  max: number;
  /**
   * The minimum value of the knob (default 0)
   */
  min?: number;
  /**
   * The rendered size of the knob (default 48)
   */
  size?: number;
  /**
   * Optional reference to the knob object, useful for attaching event listeners
   */
  ref?: Ref<SVGSVGElement>;
};

/**
 * Renders a simple SVG knob component
 */
export const SVGKnob: Component<SVGKnobProps> = (props) => {
  // Fraction the knob is turned
  const frac = (): number =>
    (props.value - (props.min ?? 0)) / (props.max - (props.min ?? 0));
  // Range of knob rotation as fraction of 2Pi
  const range = 3 / 4;
  // Graphic parameters
  const pad = 10;
  const r = 50;
  const c = { x: r + pad, y: r + pad }; // Circle Centre
  const circleOffset = 3 / 4;
  const theta = (): number =>
    2 * Math.PI * (frac() * range + (1 - circleOffset));

  // Offset for track beginning
  const gap = Math.PI / 15;
  const trackAngle = (): number => theta() + gap;

  // Get the absolute coordinates given an angle
  const pos = (angle: number): Vec2 => {
    const rel = polarToCartesian(r, angle);
    return Vec2Add(rel, c);
  };
  const largeArc = (): 0 | 1 => (theta() > (3 * Math.PI) / 2 === true ? 1 : 0);
  return (
    <svg
      ref={props.ref}
      class={style.knob}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ?? 48}
      height={props.size ?? 48}
    >
      {theta() + gap < 2 * Math.PI && (
        <path
          class={style.track}
          d={`M ${c.x + r},${c.y} A ${r} ${r} 0 ${
            trackAngle() > Math.PI ? 0 : 1
          } 0 ${pos(trackAngle()).x} ${pos(trackAngle()).y}`}
        />
      )}
      <path
        class={style.arc}
        d={`M ${c.x},${c.y + r} A ${r} ${r} 0 ${largeArc()} 1 ${
          pos(theta()).x
        } ${pos(theta()).y}`}
      />
      <path
        class={style.dial}
        d={`M ${c.x},${c.y} L ${pos(theta()).x} ${pos(theta()).y}`}
      />
      <text class={style.value} x="70" y="100">
        {props.value.toFixed(2)}
      </text>
    </svg>
  );
};
