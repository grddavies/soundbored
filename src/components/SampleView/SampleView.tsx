import { Component, createEffect } from 'solid-js';
import { useAudioContext, useObservable } from 'src/hooks';
import { SamplerModel } from 'src/models';
import { AppStore } from 'src/store';

import './SampleView.css';

type SampleViewProps = {
  model: SamplerModel;
};

export const SampleView: Component<SampleViewProps> = (props) => {
  let canvas: HTMLCanvasElement;
  const getAudioCtx = useAudioContext();

  const [src, setSrc] = useObservable(props.model.src);

  createEffect(async () => {
    const audioCtx = getAudioCtx();
    // TODO: Cache processed audiodata in db
    const blob = await AppStore.instance.getSampleBlob(src());
    if (!audioCtx || !blob) return;
    const audioData = await audioCtx.decodeAudioData(await blob.arrayBuffer());
    // process audioData
    // draw audiodata
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    const data = audioData.getChannelData(0);
    canvasCtx.strokeStyle = '#da571a'; // TODO: link to css
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
          setSrc(e.dataTransfer.getData('text/plain'));
        }
      }}
    >
      <canvas ref={canvas!} />
    </div>
  );
};
