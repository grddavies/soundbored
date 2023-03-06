import './SampleView.css';

import { Component, createEffect } from 'solid-js';
import { AudioCtx } from 'src/audio';
import { WAVEFORM_SIZE } from 'src/defaults/constants';
import { useSelectedSampler } from 'src/hooks/useSelectedSampler';
import { SamplePlayer, updateSampleSrc } from 'src/models/SamplePlayer';
import { SampleStore } from 'src/samples';

/**
 * Create Waveform Data
 *
 * Create waveform data and cache in indexeddb
 */
async function createWaveform(
  src: string,
  audioCtx: AudioContext,
): Promise<Float32Array> {
  const blob = await SampleStore.instance.getSampleBlob(src);
  if (!blob) {
    throw new Error(`Could not find '${src}'`);
  }
  const audioData = await audioCtx.decodeAudioData(await blob.arrayBuffer());
  const data = audioData.getChannelData(0);
  const resampled = downsample(data, WAVEFORM_SIZE);
  const waveform = normalize(resampled);
  await SampleStore.instance.addSample({
    filename: src,
    data: blob,
    waveform: waveform,
  });
  return waveform;
}

/**
 * Downsample audio data for visualization
 * @param data - full sample rate audio data
 * @param nChunks - length of output data
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
 * @param data - Originial amplitude data
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
  model: SamplePlayer;
};

// Padding in canvas pixels
const PAD_X = 10;
const PAD_Y = 10;

export const SampleView: Component<SampleViewProps> = (props) => {
  let canvas: HTMLCanvasElement;
  createEffect(async () => {
    const audioCtx = AudioCtx();
    if (!audioCtx) return;
    const waveform =
      (await SampleStore.instance.getSampleWaveform(props.model.src)) ??
      (await createWaveform(props.model.src, audioCtx));
    plotWaveform(waveform, canvas);
  });
  const { mutateSelected } = useSelectedSampler();
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
        mutateSelected((sampler) => {
          if (e.dataTransfer) {
            updateSampleSrc(sampler, e.dataTransfer.getData('text/plain'));
          }
        });
      }}
    >
      <canvas ref={canvas!} width="1600" height="300" />
    </div>
  );
};
