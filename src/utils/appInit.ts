import { Defaults } from 'src/defaults/Defaults';
import { SampleStore } from 'src/samples';

import { Logger } from './Logger';

/**
 * Initialise App resources
 */
export async function appInit(): Promise<void> {
  SampleStore.init();
  performance.mark('fetch-sample-start');
  const results = await Promise.allSettled(
    Defaults.samples.map(async (x) => {
      try {
        await x.ensureCached();
        return Promise.resolve();
      } catch (e) {
        Logger.error(`Failed to load sample '${x}'`, e);
        return Promise.reject();
      }
    }),
  );
  performance.mark('fetch-sample-end');
  const counts = results.reduce(
    (acc, x) => {
      acc[x.status] += 1;
      return acc;
    },
    {
      fulfilled: 0,
      rejected: 0,
    },
  );
  const measure = performance.measure(
    'fetch-sample-duration',
    'fetch-sample-start',
    'fetch-sample-end',
  );
  if (counts.fulfilled) {
    Logger.info(`Successfully loaded ${counts.fulfilled} samples`);
  }
  if (counts.rejected) {
    Logger.warn(`Failed to load ${counts.rejected} samples`);
  }
  Logger.debug(`Sample fetch took ${Math.ceil(measure.duration)}ms`);
}
