import { Component, Ref } from 'solid-js';

import './Knob.css';

function polarToCartesian(r: number, theta: number) {
  return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
}

type KnobProps = {
  value: number;
  max: number;
  min?: number;
  size?: number;
  ref?: Ref<SVGSVGElement>;
};

export const Knob: Component<KnobProps> = (props) => {
  // Fraction the knob is turned
  const frac = () =>
    (props.value - (props.min ?? 0)) / (props.max - (props.min ?? 0));
  // Range of knob rotation as fraction of 2Pi
  const range = 3 / 4;
  // Graphic parameters
  const pad = 10;
  const r = 50;
  const circumference = 2 * Math.PI * r;
  const trackLength = range * circumference;
  const c = { x: r + pad, y: r + pad }; // Circle Centre
  const circleOffset = 3 / 4;
  const theta = () => 2 * Math.PI * (frac() * range + (1 - circleOffset));
  const relativeDialPos = () => polarToCartesian(r, theta());
  const trackFill = () => frac() * trackLength;
  const strokeDashArray = () => `${trackFill()} ${circumference - trackFill()}`;
  return (
    <svg
      ref={props.ref}
      class="knob"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ?? 48}
      height={props.size ?? 48}
    >
      <circle
        class="track"
        cx={c.x}
        cy={c.y}
        r={r}
        stroke-dasharray={`${trackLength} ${circumference - trackLength}`}
        stroke-dashoffset={circleOffset * circumference}
        fill="none"
        stroke-linecap="round"
      />
      <circle
        class="arc"
        cx={c.x}
        cy={c.y}
        r={r}
        stroke-dasharray={strokeDashArray()}
        stroke-dashoffset={circleOffset * circumference}
        stroke-linecap="round"
        fill="none"
      />
      <path
        class="dial"
        d={`M ${c.x},${c.y} L ${c.x + relativeDialPos().x} ${
          c.y + relativeDialPos().y
        }`}
        stroke-linecap="round"
      />
      <text class="value" x="70" y="100">
        {props.value.toFixed(1)}
      </text>
    </svg>
  );
};
