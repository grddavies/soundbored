import { AppStore } from 'src/store';

import snore from 'src/assets/sounds/AUUGHHH.mp3';
import scratch from 'src/assets/sounds/scratch.wav';
import sweetpea from 'src/assets/sounds/sweet_pea.wav';
import { getDirtSample } from './downloads';

async function fetchDefaultSamples() {
  const links = [
    'https://dobrian.github.io/cmp/topics/sample-recording-and-playback-with-web-audio-api/freejazz.wav',
    snore,
    scratch,
    sweetpea,
  ];
  links.forEach(async (url, i) => {
    let filename = url.split('/').at(-1)!;
    fetch(url)
      .then((data) => data.blob())
      .then((blob) =>
        AppStore.instance.sample.put({
          filename: filename,
          data: blob,
        }),
      );
  });
}

async function getDirtSamples() {
  ['gabba/000_0.wav'].forEach(async (path, i) => {
    let filename = path.split('/').at(-1)!;
    getDirtSample(path).then((array) =>
      AppStore.instance.sample.put({
        filename: filename,
        data: new Blob([array]),
      }),
    );
  });
}

export async function appInit() {
  AppStore.init();
  await Promise.all([fetchDefaultSamples(), getDirtSamples()]);
  console.log('App Data Loaded');
}
