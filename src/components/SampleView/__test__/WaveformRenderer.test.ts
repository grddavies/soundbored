import { WaveformRenderer } from '../WaveformRenderer';

class AudioBufferPolyfill implements AudioBuffer {
  private _channels: Float32Array[];
  get duration(): number {
    return this.length * this.sampleRate;
  }

  get length(): number {
    return this._channels[0].length;
  }

  get numberOfChannels(): number {
    return this._channels.length;
  }

  readonly sampleRate: number;

  copyFromChannel(
    destination: Float32Array,
    channelNumber: number,
    bufferOffset = 0,
  ): void {
    const chan = this._channels[channelNumber];
    for (let i = bufferOffset; i < chan.length; i++) {
      destination[i] = chan[i];
    }
  }

  copyToChannel(
    source: Float32Array,
    channelNumber: number,
    bufferOffset = 0,
  ): void {
    for (let i = 0; i < source.length; i++) {
      this._channels[channelNumber][i + bufferOffset] = source[i];
    }
  }

  getChannelData(channel: number): Float32Array {
    return this._channels[channel];
  }

  constructor(options: AudioBufferOptions) {
    this._channels = new Array(options.numberOfChannels ?? 1)
      .fill(null)
      .map(() => new Float32Array(options.length));

    this.sampleRate = options.sampleRate;
  }
}

test('Basic render sine waveform', () => {
  // Assemble
  const fs = 44100;
  const durationS = 1;
  const bufLen = fs * durationS;
  const audioBuf = new AudioBufferPolyfill({
    length: bufLen,
    sampleRate: fs,
    numberOfChannels: 1,
  });
  const data = new Float32Array(audioBuf.length);
  for (
    let i = 0, x = 0, dx = (2 * Math.PI) / audioBuf.length;
    i < audioBuf.length;
    i++, x += dx
  ) {
    data[i] = Math.sin(x);
  }
  audioBuf.copyToChannel(data, 0);

  const renderer = new WaveformRenderer(audioBuf);

  // Act
  renderer.update(
    { pan: { x: 0, y: 0 }, zoom: { x: 1, y: 1 } },
    { width: 360, height: 100 },
  );
  const channels = renderer.points;
  const path = channels[0];

  // Assert
  expect(channels.length).toBe(1);
  expect(path[0].y).toBe(50); // Height / 2
  expect(path[50].y).toBeLessThan(50);
  expect(path[bufLen / 2].y).toBeCloseTo(50);
});
