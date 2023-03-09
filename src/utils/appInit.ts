import { Defaults } from 'src/defaults/Defaults';
import { SampleStore } from 'src/samples';

export async function appInit(): Promise<void> {
  SampleStore.init();
  await Promise.all(
    Defaults.samples.map(async (x) => {
      try {
        await x.ensureCached();
      } catch (e) {
        console.error(e);
      }
    }),
  );
}
