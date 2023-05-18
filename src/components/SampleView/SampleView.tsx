import { createPointerListeners } from '@solid-primitives/pointer';
import { createElementSize, Size } from '@solid-primitives/resize-observer';
import assert from 'assert';
import {
  Component,
  createMemo,
  createResource,
  createSignal,
  Match,
  Switch,
} from 'solid-js';
import { AudioCtx } from 'src/audio';
import { SampleDropzone } from 'src/components';
import { Vec2 } from 'src/math';
import { SamplePlayer } from 'src/models/SamplePlayer';
import { SampleStore } from 'src/samples';

import style from './SampleView.module.css';

type Camera2D = {
  /**
   * Camera pan
   * x: from 0, upper bound limited by number of samples
   * y: unused
   */
  pan: Vec2;
  /**
   * Camera zoom
   * x, y: from 1
   */
  zoom: Vec2;
};

/**
 * Vertical padding in px
 */
const PAD_Y = 10;

/**
 * Return a view of an an audio buffer based on a camera position
 * @param audio
 * @param camera2D
 * @returns
 */
function windowSamples(
  audio: Float32Array,
  camera2D: Readonly<Camera2D>,
): Float32Array {
  return audio.subarray(
    Math.max(0, 0 + camera2D.pan.x),
    Math.min(Math.floor(audio.length / camera2D.zoom.x), audio.length),
  );
}

/**
 * Convert audio channel data to an SVG path `d` parameter string
 * @param audio single channel of audio data
 * @param size size of the viewport
 * @param camera camera pan and zoom
 */
function audioSampleToSVG(
  audio: Float32Array,
  size: Readonly<Size>,
  camera: Readonly<Camera2D>,
): string {
  // Get a view of the samples within the window
  const window = windowSamples(audio, camera);
  // Number of samples in output array
  const nSamples = Math.min(size.width * 4, window.length);
  const chunkSize = Math.floor(window.length / nSamples);
  // TODO: improve downsample algorithm
  const zeroLine = size.height / 2;
  const tX = (x: number): number => (x * size.width) / nSamples;
  const tY = (y: number): number =>
    zeroLine + y * (size.height - PAD_Y) * 0.5 * camera.zoom.y;
  let dString = `M 0 ${window[0]}`;
  for (let i = 1; i < nSamples; i++) {
    const chunk = window.subarray(i * chunkSize, (i + 1) * chunkSize);
    dString += ` L ${tX(i)} ${tY(chunk[0])}`;
    // We transform the amplitude to a position in screen space
    // Note: Pan y not implemented
    // Note: Does not handle 32bit float overflow with +ve zoom y
  }
  return dString;
}

/**
 * Fetch audio channel data from a sample src
 */
async function fetchAudioBuffer({
  src,
  ctx,
}: {
  src: string;
  ctx: AudioContext | null;
}): Promise<Float32Array[]> {
  const cached = SampleStore.instance.getChannelData(src);
  if (cached) return cached;
  const blob = await SampleStore.instance.getSampleBlob(src);
  if (!blob || !ctx) return [];
  const audioBuf = await ctx.decodeAudioData(await blob.arrayBuffer());
  const channelData: Float32Array[] = new Array(audioBuf.numberOfChannels)
    .fill(null)
    .map((_, i) => {
      const orig = new Float32Array(audioBuf.length);
      audioBuf.copyFromChannel(orig, i);
      return orig;
    });
  SampleStore.instance.cacheChannelData(src, channelData);
  return channelData;
}

type SampleViewProps = {
  model: SamplePlayer;
};

/**
 * Renders a component for viewing audio samples
 * @param props
 * @returns
 */
export const SampleView: Component<SampleViewProps> = (props) => {
  let divRef: HTMLDivElement | undefined;
  let svgRef: SVGSVGElement | undefined;

  // Container element size to set SVG size
  const size = createElementSize(() => divRef);

  // TODO: Waveform Pan/Zoom
  const camera = (): Camera2D => ({
    pan: { x: 0, y: 0 },
    zoom: { x: 1, y: 1 },
  });

  const [originalSample] = createResource(
    () => ({ src: props.model.src, ctx: AudioCtx() }),
    fetchAudioBuffer,
  );

  // Waveform zero crossing point
  const y0 = (): number => (size.height || 0) / 2;

  const waveformPaths = createMemo(() => {
    const ctx = AudioCtx();
    const sample = originalSample();
    const cameraPos = camera();
    const clientSize = { width: size.width ?? 0, height: size.height ?? 0 };
    if (!sample || !ctx) return [];
    return sample.map((original) => (
      <path
        class={style.waveform}
        d={audioSampleToSVG(original, clientSize, cameraPos)}
      />
    ));
  });

  const [currentPointer, setCurrentPointer] = createSignal<number | null>(null);
  const [_dragStartY, setDragStartY] = createSignal(0);
  const [dragStartX, setDragStartX] = createSignal<null | number>(0);

  const clearMoveHandler = (e: PointerEvent): void => {
    if (e.pointerId === currentPointer()) {
      setCurrentPointer(null);
      setDragStartX(null);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', clearMoveHandler);
    }
  };

  const handleMove = (e: PointerEvent): void => {
    if (e.pointerId === currentPointer()) {
      // Prevent scroll
      e.preventDefault();
      e.stopImmediatePropagation();
      // TODO: touchpad pan/zoom
    }
  };

  createPointerListeners({
    target: () => svgRef,
    onDown: (e) => {
      assert(svgRef);
      const rect = svgRef.getBoundingClientRect();
      setDragStartY(e.clientY - rect.top);
      setDragStartX(e.clientX - rect.left);
      setCurrentPointer(e.pointerId);
      window.addEventListener('pointerup', clearMoveHandler, {
        passive: false,
      });
      window.addEventListener('pointermove', handleMove, { passive: false });
    },
  });

  return (
    <SampleDropzone ref={divRef!} class={`${style.sampleView} overflow-hidden`}>
      <svg
        ref={svgRef!}
        class="w-full h-full"
        width={size.width ?? 0}
        height={size.height ?? 0}
      >
        <g>
          <Switch>
            <Match when={!AudioCtx()}>
              <text
                class={`${style.fgLight} font-bold text-sm`}
                x="50%"
                y="50%"
                text-anchor="middle"
                alignment-baseline="middle"
              >
                Audio Engine Off
              </text>
            </Match>
            <Match when={originalSample.state === 'ready'}>
              <path
                class={style.midline}
                d={`M 0 ${y0()} L ${size.width ?? 0} ${y0()}`}
              />
              {...waveformPaths()}
              {dragStartX() != null && (
                <path
                  class={style.dragline}
                  d={`M ${dragStartX()! - camera().pan.x} 0 V ${
                    size.height ?? 0
                  }`}
                />
              )}
            </Match>
            <Match when={originalSample.state === 'errored'}>
              <text
                class={`${style.fgLight} font-bold text-sm`}
                x="50%"
                y="50%"
                text-anchor="middle"
                alignment-baseline="middle"
              >
                No Sample Loaded
              </text>
            </Match>
            <Match when={originalSample.loading}>
              <text
                class={`${style.fgLight} font-bold text-sm`}
                x="50%"
                y="50%"
                text-anchor="middle"
                alignment-baseline="middle"
              >
                ... Loading
              </text>
            </Match>
          </Switch>
        </g>
      </svg>
    </SampleDropzone>
  );
};
