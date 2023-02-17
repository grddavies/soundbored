// playback position hack:
// https://github.com/WebAudio/web-audio-api/issues/2397#issuecomment-459514360

/**
 * AudioPlayerNode
 * Composite Web Audio API Node that tracks the playback position
 * and playing state of the underlying AudioBufferSourceNode
 */
export class AudioPlayerNode {
  public readonly audio: AudioBufferSourceNode;
  private _splitter: ChannelSplitterNode;
  private _audioOut: ChannelMergerNode;
  private _sampleHolder: Float32Array;
  private _analyser: AnalyserNode;
  private _playing = false;

  constructor(context: AudioContext, options?: AudioBufferSourceOptions) {
    // Initialize component audio nodes
    this.audio = new AudioBufferSourceNode(context, options);
    this._splitter = new ChannelSplitterNode(context);
    this._analyser = new AnalyserNode(context);
    this._audioOut = new ChannelMergerNode(context);
    this._sampleHolder = new Float32Array(1);

    this.audio.addEventListener('ended', () => {
      this._playing = false;
    });
  }

  /**
   * Gets the current playback position [0, 1]
   */
  get playbackPosition(): number {
    this._analyser.getFloatTimeDomainData(this._sampleHolder);
    return this._sampleHolder[0];
  }

  /**
   * true if buffer is currently playing
   */
  get playing(): boolean {
    return this._playing;
  }

  /** Creates an AudioBuffer with an extra `position` track
   * @param buffer AudioBuffer to load into node
   * */
  public loadBuffer(audioBuffer: AudioBuffer): void {
    // Create a new AudioBuffer of the same length as param with one extra channel
    // load it into the AudioBufferSourceNode
    const n_channels = Math.max(audioBuffer.numberOfChannels, 3);
    const p_channel = n_channels - 1;
    this.audio.buffer = new AudioBuffer({
      length: audioBuffer.length,
      sampleRate: audioBuffer.sampleRate,
      numberOfChannels: n_channels,
    });

    // Copy data from the audioBuffer arg to our new AudioBuffer
    if (audioBuffer.numberOfChannels == 1) {
      // We upmix mono audio to L and R channels
      this.audio.buffer.copyToChannel(audioBuffer.getChannelData(0), 0);
      this.audio.buffer.copyToChannel(audioBuffer.getChannelData(0), 1);
    } else {
      for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
        this.audio.buffer.copyToChannel(audioBuffer.getChannelData(ch), ch);
      }
    }

    // Fill up the position channel with numbers from 0 to 1
    const posBuffer = this.audio.buffer.getChannelData(p_channel);
    for (let i = 0; i < audioBuffer.length; i++) {
      posBuffer[i] = i / audioBuffer.length;
    }

    // Split the channels
    this.audio.connect(this._splitter);

    // Connect all the audio channels to the line out
    for (let ch = 0; ch < p_channel; ch++) {
      this._splitter.connect(this._audioOut, ch, ch);
    }

    // Connect the position channel to an analyzer so we can extract position data
    this._splitter.connect(this._analyser, p_channel);
  }

  get playbackRate(): AudioParam {
    return this.audio.playbackRate;
  }

  start(...args: Parameters<AudioBufferSourceNode['start']>): void {
    this._playing = true;
    this.audio.start(...args);
  }

  stop(when?: number | undefined): void {
    this.audio.stop(when);
  }

  connect(destinationNode: AudioNode, output?: number | undefined): AudioNode {
    return this._audioOut.connect(destinationNode, output);
  }
}
