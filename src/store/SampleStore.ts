import { Database } from 'src/store/Database';

import { TSample } from './datatypes';

/**
 * # SampleStore
 * ## Description
 * Singleton helper to manage storage of samples
 */
export class SampleStore {
  private _db = new Database();

  private static _instance: SampleStore;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    // Noop
  }

  /**
   * Globally initialize the sample store
   */
  public static init(): void {
    SampleStore._instance = new SampleStore();
  }

  /**
   * Get the globally active sample store
   *
   * Automatically initialise the store if it is not active
   */
  public static get instance(): SampleStore {
    if (!SampleStore._instance) {
      SampleStore.init();
    }
    return SampleStore._instance;
  }

  /**
   * Get raw file data for a sample
   * @param filename - Name of the file
   * @returns blob associated with filename
   */
  public async getSampleBlob(filename: string): Promise<Blob | undefined> {
    return await this._db.sample
      .get({ filename })
      .then((sample) => sample?.data);
  }

  /**
   * Get the preprocessed waveform data for sample
   * @param filename - Name of the file
   * @returns array of the sample data if present
   */
  public async getSampleWaveform(
    filename: string,
  ): Promise<Float32Array | undefined> {
    return await this._db.sample
      .get({ filename })
      .then((sample) => sample?.waveform);
  }

  /**
   * Query all available sample filenames
   *
   * @returns an array of filenames from the samples table
   */
  public async getAllSampleFileNames(): Promise<string[]> {
    return (await this._db.sample.toCollection().keys()) as string[];
  }

  /**
   * Add or updates a sample in the database from a file
   *
   * @param file - File to add to the database indexed on its name
   * @returns The ID of the upserted object
   */
  public async addSampleFromFile(file: File): Promise<number> {
    return await this._db.sample.put({
      filename: file.name,
      data: file,
    });
  }

  /**
   * Add or updates a sample in the database
   *
   * @param sample - Sample object to add
   * @returns The ID of the upserted object
   */
  public async addSample(sample: TSample): Promise<number> {
    return await this._db.sample.put(sample);
  }

  /**
   * Adds a new sample to the database
   *
   * @param filename - Name of the file to delete
   * @returns The number of deleted files
   */
  public async deleteSampleByName(filename: string): Promise<number> {
    return await this._db.sample.where({ filename }).delete();
  }
}
