import assert from 'assert';
import { NUM_PADS } from 'src/defaults/constants';
import { DirtSample, WebSample } from 'src/defaults/DefaultSample';

export class Defaults {
  public static samples = [
    new WebSample(
      'https://dobrian.github.io/cmp/topics/sample-recording-and-playback-with-web-audio-api/freejazz.wav',
      'Freejazz',
    ),
    new DirtSample('moog/000_Mighty Moog C2.wav', 'Moog C2'),
    new DirtSample('juno/03_juno_chorus_low.wav', 'Juno'),
    new DirtSample('jazz/007_SN.wav', 'Snare'),
    new DirtSample('bleep/checkpoint-hit.wav', 'Bleep'),
    new DirtSample('808/CH.WAV', '808CH'),
    new DirtSample('808oh/OH00.WAV', '808OH'),
    new DirtSample('808bd/BD0010.WAV', '808BD'),
    new DirtSample('808bd/BD0025.WAV', '808BD2'),
    new DirtSample('808/CP.WAV', '808CP'),
    new DirtSample('808/RS.WAV', '808RS'),
    new DirtSample('juno/04_juno_chorus_mid.wav', 'Juno Mid'),
    new DirtSample('birds/001_10.wav', 'Birdies'),
    new DirtSample('bleep/pc_beep.wav', 'Beep'),
  ] as const;
}

assert(Defaults.samples.length > NUM_PADS, 'Not enough default samples');
