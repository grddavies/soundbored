import './SampleView.css';

import { Component, createEffect, createMemo } from 'solid-js';
import { WAVEFORM_SIZE } from 'src/defaults/constants';
import { useAudioContext, useObservable } from 'src/hooks';
import { SamplerModel } from 'src/models';
import { AppStore } from 'src/store';

/**
 * Create Waveform Data
 *
 * Create waveform data and cache in indexeddb
 */
async function createWaveform(
  src: string,
  audioCtx: AudioContext,
): Promise<Float32Array> {
  const blob = await AppStore.instance.getSampleBlob(src);
  if (!blob) {
    throw new Error(`Could not find '${src}'`);
  }
  const audioData = await audioCtx.decodeAudioData(await blob.arrayBuffer());
  const data = audioData.getChannelData(0);
  const resampled = downsample(data, WAVEFORM_SIZE);
  const waveform = normalize(resampled);
  await AppStore.instance.addSample({
    filename: src,
    data: blob,
    waveform: waveform,
  });
  return waveform;
}

/**
 * Downsample audio data for visualization
 * @param data
 * @param nChunks length of output data
 */
function downsample(data: Float32Array, nChunks: number): Float32Array {
  const chunkSize = Math.floor(data.length / nChunks);
  const filtered = new Float32Array(nChunks);
  for (let i = 0; i < nChunks; i++) {
    const chunk = data.subarray(i * chunkSize, (i + 1) * chunkSize);
    filtered[i] = chunk.reduce((x, y) => x + y) / chunkSize;
  }
  return filtered;
}

/**
 * Normalize data
 * @param data raw data
 * @returns normalized clone of data
 */
function normalize(data: Float32Array): Float32Array {
  const scale = Math.pow(Math.max(...data.map(Math.abs)), -1);
  return data.map((x) => x * scale);
}

function plotWaveform(data: Float32Array, canvas: HTMLCanvasElement): void {
  const totalWidth = canvas.width - 2 * PAD_X;
  const canvasCtx = canvas.getContext('2d');
  if (!canvasCtx) return;
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  canvasCtx.strokeStyle = '#da571a'; // TODO: link to css
  canvasCtx.lineWidth = 5;
  const midline = canvas.height / 2;
  let x = PAD_X;
  let y = midline;
  canvasCtx.beginPath();
  canvasCtx.moveTo(x, y);
  for (const d of data) {
    x += totalWidth / data.length;
    y = midline + d * ((canvas.height - PAD_Y) / 2);
    canvasCtx.lineTo(x, y);
  }
  canvasCtx.stroke();
}

type SampleViewProps = {
  model: SamplerModel;
};

// Padding in canvas pixels
const PAD_X = 10;
const PAD_Y = 10;

export const SampleView: Component<SampleViewProps> = (props) => {
  let canvas: HTMLCanvasElement;
  const getAudioCtx = useAudioContext();
  const viewModel = createMemo(() => {
    const [src, setSrc] = useObservable(props.model.src);
    return {
      get src(): string {
        return src();
      },
      set src(v: string) {
        setSrc(v);
      },
    };
  });

  createEffect(async () => {
    const audioCtx = getAudioCtx();
    if (!audioCtx) return;
    const waveform =
      (await AppStore.instance.getSampleWaveform(viewModel().src)) ??
      (await createWaveform(viewModel().src, audioCtx));
    plotWaveform(waveform, canvas);
  });

  return (
    <div
      class="sampleView"
      onDragOver={(e) => {
        e.preventDefault();
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'link';
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer) {
          viewModel().src = e.dataTransfer.getData('text/plain');
        }
      }}
    >
      <canvas ref={canvas!} width="1600" height="300" />
    </div>
  );
};
