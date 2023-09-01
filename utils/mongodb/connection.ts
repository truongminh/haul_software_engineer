import { Db, MongoClient } from 'mongodb';

const connStr = 'mongodb+srv://u0:GuBCHfJV54RVyY4M@cluster0.8vjcbyf.mongodb.net/?retryWrites=true&w=majority';
const dbName = "dot_inspection";

export class MongoDBConnection {
  private static isConnected: boolean = false;
  private static db: Db;

  public static getConnection(result: (connection) => void) {
    if (this.isConnected) {
      return result(this.db);
    } else {
      this.connect((error, db: Db) => {
        return result(this.db);
      });
    }
  }

  private static connect(result: (error, db: Db) => void) {
    MongoClient.connect(connStr).then(client => {
      this.db = client.db(dbName);
      this.isConnected = true;
      return result(null,this.db)
    }).catch(error => {
      return result(error, null)
    })
  }
}
