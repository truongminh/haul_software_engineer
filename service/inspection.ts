import { inject, injectable } from 'inversify';
import { MongoDBClient } from '../utils/mongodb/client';
import TYPES from '../constant/types';
import { Inspection } from '../models/inspection';
import { IPage, IQuery, ResponseWithPage } from '../models/page';
import COLLECTIONS from '../constant/collection';

@injectable()
export class InspectionsService {
  private mongoClient: MongoDBClient;

  constructor(
    @inject(TYPES.MongoDBClient) mongoClient: MongoDBClient
  ) {
    this.mongoClient = mongoClient;
  }

  public async getInspections(query: IQuery):Promise<ResponseWithPage<Inspection>> {

    const filter = {}

    if (query.filter_basic !== ""){
      filter["basic"] = query.filter_basic
    }


    const total = await this.mongoClient.db.collection(COLLECTIONS.Inspections).countDocuments(filter)
    const data = await this.mongoClient.db.collection(COLLECTIONS.Inspections).aggregate(
      [
        {
          $match: filter,
        },
        {
          $sort: { date: query.sort_order }
        },
        {
          $skip: query.page_number * query.page_size
        },
        {
          $limit: query.page_size
        },
        {
          $unset:["vins"]
        }
      ]
    ).toArray()

    return new ResponseWithPage<Inspection>(data as Inspection[], {
      page_size: query.page_size,
      page_number: query.page_number,
      total: total,
      total_page: Math.ceil(total / query.page_size)
    } as IPage)
  }

  public async getInspection(id: string): Promise<Object> {

    const data = await this.mongoClient.db.collection(COLLECTIONS.Inspections).aggregate(
      [
        {
          $match: {
            _id: id
          },
        },
        {
          $unwind: "$vins"
        },

        {
          $lookup:{
            from: COLLECTIONS.Violations,
            localField: 'vins',
            foreignField: 'vin',
            as: '_vins'
          }
        },

        {
          $lookup:{
            from: COLLECTIONS.Vehicles,
            localField: 'vins',
            foreignField: '_id',
            as: '_vehis'
          }
        },
      
        {
          $group: {
            _id: "$_id",
            date: {
              $first: "$date"
            },
            state: {
              $first: "$state"
            },
            level: {
              $first: "$level"
            },
            weight: {
              $first: "$weight"
            },
            hm: {
              $first: "$hm"
            },
            phm: {
              $first: "$phm"
            },

            vins: {
              $push: "$vins"
            },
            _vins: {
              $push: "$_vins"
            },
            _vehis: {
              $push: "$_vehis"
            }
          }
        },
        {
          $project:{
            _id: 1,
            date:1,
            state:1,
            level:1,
            weight:1,
            hm:1,
            phm:1,
            vins: {
              $reduce: {
                input: "$_vins",
                initialValue: [],
                in: { $concatArrays: ['$$value', '$$this'] }
              }
            },
            vehis: {
              $reduce: {
                input: "$_vehis",
                initialValue: [],
                in: { $concatArrays: ['$$value', '$$this'] }
              }
            },
          }
        }
      ]
    ).toArray()

    return data[0]
  }
}
