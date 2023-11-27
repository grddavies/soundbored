import { Database } from 'src/samples/Database';

import { Sample } from '../models/Sample';

/**
 * # SampleStore
 * ## Description
 * Singleton helper to manage storage of audio sample data
 */
export class SampleStore {
  private _db = new Database();

  private static _instance: SampleStore;

  private _channelDataStore: Map<string, AudioBuffer> = new Map();

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
   * Set audio channel data in the cache
   * @param filename
   * @param audioBuf
   */
  public cacheAudioBuffer(filename: string, audioBuf: AudioBuffer): void {
    this._channelDataStore.set(filename, audioBuf);
  }

  /**
   * Clear/delete audio channel data from the cache
   * @param filename
   * @param data
   */
  public clearAudioBufferCache(filename: string): boolean {
    return this._channelDataStore.delete(filename);
  }

  /**
   * Get audio channel data from the cache if it exists
   * @param filename
   * @returns
   */
  public getAudioBuffer(filename: string): AudioBuffer | undefined {
    return this._channelDataStore.get(filename);
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
  public async addSample(sample: Sample): Promise<number> {
    return await this._db.sample.put(sample);
  }

  /**
   * Adds a new sample to the database
   *
   * @param filename - Name of the file to delete
   * @returns The number of deleted files
   */
  public async deleteSampleByName(filename: string): Promise<number> {
    this.clearAudioBufferCache(filename);
    return await this._db.sample.where({ filename }).delete();
  }
}
