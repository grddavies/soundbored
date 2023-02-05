import { Component, Ref } from 'solid-js';

import './Knob.css';

function polarToCartesian(r: number, theta: number) {
  const angle = (Math.PI * theta) / 180;
  return { x: r * Math.cos(angle), y: r * Math.sin(angle) };
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
  // Full range of knob rotation
  const fullTurn = 270;
  // Graphic parameters
  const r = 50;
  const circumference = 2 * Math.PI * r;
  // Total length of the track
  const trackLength = (fullTurn / 360) * circumference;
  const c = { x: 60, y: 60 }; // Circle Centre
  const circleOffset = 0.75;
  const thetaDeg = () => frac() * fullTurn + (1 - circleOffset) * 360;
  const relativeDialPos = () => polarToCartesian(r, thetaDeg());
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
