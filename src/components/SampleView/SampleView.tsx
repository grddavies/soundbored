import { createElementSize } from '@solid-primitives/resize-observer';
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
import { Vec2, Vec2Sub } from 'src/math';
import { SamplePlayer } from 'src/models/SamplePlayer';
import { SampleStore } from 'src/samples';
import { GlobalState } from 'src/store';

import style from './SampleView.module.css';
import { WaveformRenderer } from './WaveformRenderer';

const ZOOM_SENSITIVITY = 0.01;

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
}): Promise<AudioBuffer | undefined> {
  const cached = SampleStore.instance.getAudioBuffer(src);
  if (cached) return cached;
  const blob = await SampleStore.instance.getSampleBlob(src);
  if (!blob || !ctx) return undefined;
  const audioBuf = await ctx.decodeAudioData(await blob.arrayBuffer());
  // TODO: (perf) Clear cache when no more pads load this sample
  SampleStore.instance.cacheAudioBuffer(src, audioBuf);
  return audioBuf;
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

  // SVG path elements rendering the audio channel data
  const waveformPaths = createMemo(() => {
    const audioBuf = audioData();
    if (!size.width || !size.height || !audioBuf || !audioBuf.length) return [];
    const renderer = new WaveformRenderer(audioBuf);
    renderer.update(props.model.camera, size);
    return renderer
      .getPaths()
      .map((d, i) => (
        <path
          class={`${style.waveform} ${i ? style['waveform-right'] : ''}`}
          d={d}
        />
      ));
  });

  const { mutateSelected } = useSelectedSampler();

  let dragCache = {
    position: { x: NaN, y: NaN },
    startZoom: { x: NaN, y: NaN },
    startPan: { x: NaN, y: NaN },
  };

  const [dragCursorScreenX, setDragCursorScreenX] = createSignal(NaN);

  makeDragHandler({
    target: () => svgRef,
    onDragStart: (start: Vec2): void => {
      const rect = svgRef!.getBoundingClientRect();
      const startPos = Vec2Sub(start, props.model.camera.pan);
      dragCache = {
        position: startPos,
        startZoom: { ...props.model.camera.zoom },
        startPan: { ...props.model.camera.pan },
      };

      // -0.5 so that line is middle of cursor
      setDragCursorScreenX(startPos.x - rect.x - 0.5);
    },
    onDragMove: (delta) => {
      const zoomDiff = delta.y * ZOOM_SENSITIVITY;
      const zoomFactor = 1 + zoomDiff;
      const newZoom = Math.max(1, dragCache.startZoom.x * zoomFactor);
      mutateSelected((sampler) => {
        if (newZoom !== props.model.camera.zoom.x) {
          sampler.camera.zoom.x = newZoom;
          const panX = dragCache.startPan.x - dragCache.position.x * zoomDiff;
          sampler.camera.pan.x = panX;
        }

        // TODO: Scale pan so that wavefom movement equals mouse pixel movement at any zoom
        // Need:
        // - The sample duration
        // - The viewport size
        sampler.camera.pan.x = dragCache.startPan.x - delta.x / size.width!;
        // Restrict pan offset within the bounds of the waveform
        sampler.camera.pan.x = Math.max(
          0,
          Math.min(1 - 1 / sampler.camera.zoom.x, sampler.camera.pan.x),
        );

        // Update cursor
      });
    },
    onDragEnd: () => {
      dragCache = {
        position: { x: NaN, y: NaN },
        startZoom: { x: NaN, y: NaN },
        startPan: { x: NaN, y: NaN },
      };
      setDragCursorScreenX(NaN);
      // TODO: Check that there has been an update
      GlobalState.persist();
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
              {!isNaN(dragCursorScreenX()) && (
                <path
                  class={style.dragline}
                  d={`M ${
                    dragCursorScreenX()! - props.model.camera.pan.x
                  } 0 V ${size.height ?? 0}`}
                />
              )}
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
