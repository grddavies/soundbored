import { createElementSize, Size } from '@solid-primitives/resize-observer';
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
import { makeDragHandler, useSelectedSampler } from 'src/hooks';
import { Vec2Sub } from 'src/math';
import { Camera2D } from 'src/models';
import { SamplePlayer } from 'src/models/SamplePlayer';
import { SampleStore } from 'src/samples';

import style from './SampleView.module.css';

/**
 * Vertical padding in px
 */
const PAD_Y = 10;

/**
 * Zoom scale factor
 */
const ZOOMSPEED = 0.1;

/**
 * Return a view of an an audio buffer based on a camera position
 * @param audio
 * @param camera2D
 * @returns
 */
function getVisibleWaveData(
  audio: Readonly<Float32Array>,
  camera2D: Readonly<Camera2D>,
): Float32Array {
  return audio.subarray(
    Math.floor(audio.length * camera2D.pan.x),
    Math.floor(audio.length * (camera2D.pan.x + 1 / camera2D.zoom.x)),
  );
}

/**
 * Convert audio channel data to an SVG path `d` parameter string
 * @param audio single channel of audio data
 * @param size size of the waveform viewport
 */
function audioSampleToSVG(
  channelData: Readonly<Float32Array>,
  size: Readonly<Size>,
): string {
  // Chunks = samples in output array - max of 3 samples per pixel
  const nChunks = Math.min(size.width * 3, channelData.length);
  const chunkSize = Math.floor(channelData.length / nChunks);
  // TODO: improve downsample algorithm
  // Should switch between amp env for 'long' samples and downsampling for 'short' sections
  const zeroLine = size.height / 2;
  // Transform from sample number to pixel x
  const tX = (x: number): number => (x * size.width) / nChunks;
  // Transform from sample amplitute to pixel y
  // No y zoom implemented
  const tY = (y: number): number => zeroLine + y * (size.height - PAD_Y) * 0.5;
  let dString = `M 0 ${channelData.at(0) ?? 0}`;
  for (let i = 1; i < nChunks; i++) {
    const chunk = channelData.subarray(i * chunkSize, (i + 1) * chunkSize);
    dString += ` L${tX(i)} ${tY(chunk.at(0) ?? 0)}`;
  }
  return dString;
}

/**
 * Fetch audio channel data from a sample src
 * @param src audio file source name in database
 * @param ctx active AudioContext
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

  // Waveform zero crossing point
  const y0 = (): number => (size.height || 0) / 2;

  const [audioData] = createResource(
    () => ({ src: props.model.src, ctx: AudioCtx() }),
    fetchAudioBuffer,
  );

  // View of audio data based on camera position
  const visibleData = createMemo(() => {
    const sample = audioData();
    const camera = props.model.camera;
    if (!sample) return [];
    return sample.map((channel) => getVisibleWaveData(channel, camera));
  });

  // SVG path elements rendering the audio channel data
  const waveformPaths = createMemo(() => {
    const clientSize = { width: size.width ?? 0, height: size.height ?? 0 };
    return visibleData().map((channel) => (
      <path class={style.waveform} d={audioSampleToSVG(channel, clientSize)} />
    ));
  });

  const { mutateSelected } = useSelectedSampler();

  let startPan = props.model.camera.pan.x;
  let startZoom = props.model.camera.zoom.x;

  makeDragHandler({
    target: () => svgRef,
    onDragStart: () => {
      startPan = props.model.camera.pan.x;
      startZoom = props.model.camera.zoom.x;
    },
    onDragMove: (delta) => {
      mutateSelected((sampler) => {
        sampler.camera.zoom.x = startZoom + delta.y * ZOOMSPEED;
      });
    },
    onDragEnd: () => {
      console.log(props.model.camera.zoom.x);
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
            <Match when={audioData.state === 'ready'}>
              <path
                class={style.midline}
                d={`M 0 ${y0()} L ${size.width ?? 0} ${y0()}`}
              />
              {...waveformPaths()}
            </Match>
            <Match when={audioData.state === 'errored'}>
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
            <Match when={audioData.loading}>
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
