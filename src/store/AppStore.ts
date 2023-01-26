import { IndexableTypePart } from 'dexie';
import { Database } from 'src/store/Database';
import { TSample } from './datatypes';

/**
 * AppStore
 *
 * Singleton class to manage storage of app data
 */
export class AppStore {
  private static _instance: AppStore;

  public static get instance(): AppStore {
    if (!this._instance) {
      throw new Error('AppStore not Initialized');
    }
    return this._instance;
  }

  public static init() {
    this._instance = new AppStore();
  }

  private readonly _database: Database;

  constructor() {
    this._database = new Database();
  }

  public async getSampleBlob(filename: string): Promise<Blob | undefined> {
    return (
      (await this._database.sample
        .get({ filename })
        .then((sample) => sample?.data)) ?? undefined
    );
  }

  /**
   * Create a live-query of the available sample filenames
   *
   * @returns an live-query array of sample filenames
   */
  public async getAllSampleFileNames(): Promise<string[]> {
    return (await this._database.sample.toCollection().keys()) as string[];
  }

  /**
   * Add or updates a sample in the database from a file
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
   * @returns The ID of the upserted object
   */
  public async addSample(sample: TSample): Promise<number> {
    return await this._database.sample.put(sample);
  }

  /**
   * Adds a new sample to the database
   *
   * @returns The number of deleted files
   */
  public async deleteSampleByName(filename: string): Promise<number> {
    return await this._database.sample.where({ filename }).delete();
  }
}
