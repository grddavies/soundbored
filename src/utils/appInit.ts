import { AppStore } from 'src/store';

import { Defaults } from '../defaults/Defaults';

export async function appInit(): Promise<void> {
  AppStore.init();
  await Promise.all(
    Defaults.samples.map(async (x) => {
      try {
        await x.ensureCached();
      } catch (e) {
        console.error(e);
      }
    }),
  );
  console.log('App Data Loaded');
}
