import assert from 'assert';
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
    // initialize component audio nodes
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
  get playbackPosition() {
    this._analyser.getFloatTimeDomainData(this._sampleHolder);
    return this._sampleHolder[0];
  }

  /**
   * true if buffer is currently playing
   */
  get playing() {
    return this._playing;
  }

  /** Creates an AudioBuffer with an extra `position` track
   * @param buffer AudioBuffer to load into node
   * */
  public loadBuffer(audioBuffer: AudioBuffer) {
    // create a new AudioBuffer of the same length as param with one extra channel
    // load it into the AudioBufferSourceNode
    this.audio.buffer = new AudioBuffer({
      length: audioBuffer.length,
      sampleRate: audioBuffer.sampleRate,
      numberOfChannels: audioBuffer.numberOfChannels + 1,
    });

    // Copy data from the audioBuffer arg to our new AudioBuffer
    for (let index = 0; index < audioBuffer.numberOfChannels; index++) {
      this.audio.buffer.copyToChannel(audioBuffer.getChannelData(index), index);
    }

    // Fill up the position channel with numbers from 0 to 1
    for (let index = 0; index < audioBuffer.length; index++) {
      this.audio.buffer.getChannelData(audioBuffer.numberOfChannels)[index] =
        index / audioBuffer.length;
    }

    // Split the channels
    this.audio.connect(this._splitter);

    // Connect all the audio channels to the line out
    for (let index = 0; index < audioBuffer.numberOfChannels; index++) {
      this._splitter.connect(this._audioOut, index, index);
    }

    // Connect the position channel to an analyzer so we can extract position data
    this._splitter.connect(this._analyser, audioBuffer.numberOfChannels);
  }

  get playbackRate() {
    return this.audio.playbackRate;
  }

  start(...args: Parameters<AudioBufferSourceNode['start']>) {
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
