import { AppStore } from 'src/store';

import snore from 'src/assets/sounds/AUUGHHH.mp3';
import scratch from 'src/assets/sounds/scratch.wav';

async function fetchDefaultSamples() {
  const links = [
    'https://dobrian.github.io/cmp/topics/sample-recording-and-playback-with-web-audio-api/freejazz.wav',
    snore,
    scratch,
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
export async function appInit() {
  AppStore.init();
  await fetchDefaultSamples();
  console.log('App Data Loaded');
}
