import { Db, MongoClient } from 'mongodb';
import { IConfig } from '../../config/provider';

export class MongoDBConnection {
  private static isConnected: boolean = false;
  private static db: Db;
  private static config: IConfig

  public static getConnection(config: IConfig, result: (connection) => void) {
    this.config = config
    if (this.isConnected) {
      return result(this.db);
    } else {
      this.connect((error, db: Db) => {
        return result(this.db);
      });
    }
  }

  private static connect(result: (error, db: Db) => void) {
    MongoClient.connect(this.config.connection_string).then(client => {
      this.db = client.db(this.config.db_name);
      this.isConnected = true;
      return result(null,this.db)
    }).catch(error => {
      return result(error, null)
    })
  }
}
