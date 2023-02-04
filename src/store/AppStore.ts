import { Database } from 'src/store/Database';
import { TSample } from './datatypes';

/**
 * AppStore
 *
 * Singleton class to manage storage of app data
 */
export class AppStore {
  private static _instance: AppStore;

  /**
   * The active AppStore instance
   */
  public static get instance(): AppStore {
    if (!this._instance) {
      throw new Error('AppStore not Initialized');
    }
    return this._instance;
  }

  /**
   * Globally initialise the AppStore
   */
  public static init() {
    this._instance = new AppStore();
  }

  private readonly _database: Database;

  constructor() {
    this._database = new Database();
  }

  /**
   * Get raw file data for a sample
   * @param filename the name of the file
   * @returns blob associated with filename
   */
  public async getSampleBlob(filename: string): Promise<Blob | undefined> {
    return await this._database.sample
      .get({ filename })
      .then((sample) => sample?.data);
  }

  /**
   * Get the preprocessed waveform data for sample
   * @param filename name of the file
   * @returns array of the sample data if present
   */
  public async getSampleWaveform(
    filename: string,
  ): Promise<Float32Array | undefined> {
    return await this._database.sample
      .get({ filename })
      .then((sample) => sample?.waveform);
  }

  /**
   * Query all available sample filenames
   *
   * @returns an array of filenames from the samples table
   */
  public async getAllSampleFileNames(): Promise<string[]> {
    return (await this._database.sample.toCollection().keys()) as string[];
  }

  /**
   * Add or updates a sample in the database from a file
   *
   * @param file File to add to the database indexed on its name
   * @returns The ID of the upserted object
   */
  public async addSampleFromFile(file: File): Promise<number> {
    return await this._database.sample.put({
      filename: file.name,
      data: file,
    });
  }

  /**
   * Add or updates a sample in the database
   *
   * @param sample sample object to add
   * @returns The ID of the upserted object
   */
  public async addSample(sample: TSample): Promise<number> {
    return await this._database.sample.put(sample);
  }

  /**
   * Adds a new sample to the database
   *
   * @param filename name of the file to delete
   * @returns The number of deleted files
   */
  public async deleteSampleByName(filename: string): Promise<number> {
    return await this._database.sample.where({ filename }).delete();
  }
}
