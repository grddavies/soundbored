import { Component, JSX, splitProps } from 'solid-js';
import { produce } from 'solid-js/store';
import { useSelectedSampler } from 'src/hooks';
import { SamplePlayer, updateSampleSrc } from 'src/models/SamplePlayer';
import { GlobalState } from 'src/store/AppState';

type SampleDropzoneProps = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'onDragOver' | 'ondragover' | 'ondrop' | 'onDrop'
> & { sampler?: SamplePlayer };

/**
 * Renders a dropzone for a sampler
 * By default updates the selected sampler, unless sampler is passed as prop
 * @param props
 * @returns
 */
export const SampleDropzone: Component<SampleDropzoneProps> = (props) => {
  const [, rest] = splitProps(props, ['children', 'sampler']);
  const { selectedIdx } = useSelectedSampler();
  return (
    <div
      {...rest}
      onDragOver={(e) => {
        e.preventDefault();
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'link';
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        GlobalState.setState(
          'samplers',
          props.sampler
            ? GlobalState.state.samplers.indexOf(props.sampler)
            : selectedIdx(),
          produce((sampler) => {
            if (e.dataTransfer) {
              // TODO: (perf) Clear cached sample data if no other pads have that sample loaded
              updateSampleSrc(sampler, e.dataTransfer.getData('text/plain'));
            }
          }),
        );
      }}
    >
      {props.children}
    </div>
  );
};
