import { Db } from 'mongodb';
import { injectable, inject } from 'inversify';
import { MongoDBConnection } from './connection';
import TYPES from '../../constant/types';
import { IPage, IQuery, ResponseWithPage } from '../../models/page';
import { IConfig } from '../../config/provider';

@injectable()
export class MongoDBClient {
  public db: Db;

  constructor(@inject(TYPES.Config) config: IConfig) {
    MongoDBConnection.getConnection(config, (connection) => {
      this.db = connection;
    });
  }

  public find<T>(collection: string, filter: Object, query: IQuery, result: (error, data: ResponseWithPage<T>) => void): void {
    this.db.collection(collection).find(filter).skip(query.page_number * query.page_size).limit(query.page_size).toArray().then(data => {
      this.db.collection(collection).countDocuments(filter).then(count => {
        return result(null, new ResponseWithPage(data as T[], {
          page_size: query.page_size,
          page_number: query.page_number,
          total: count,
          total_page: Math.ceil(count / query.page_size)
        } as IPage))
      }).catch(error => {
        return result(error, null)
      })

    }).catch(error => {
      return result(error, null)
    })
  }
}
