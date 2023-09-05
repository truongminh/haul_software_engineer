import { Db, MongoClient } from 'mongodb';
import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import { IConfig } from '../constant/config';

@injectable()
export class MongoDBClient {
  public db: Db;
  private client: MongoClient; 

  constructor(@inject(TYPES.Config) config: IConfig) {
    this.client = new MongoClient(config.connection_string);
    this.db = this.client.db(config.db_name);
  }

  async init() {
    await this.client.connect();
  }
}
