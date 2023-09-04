import { inject, injectable } from 'inversify';
import { MongoDBClient } from '../utils/mongodb/client';
import TYPES from '../constant/types';
import {  IQuery, IResponseWithPage } from '../models/page';
import COLLECTIONS from '../constant/collection';
import { Inspection } from '../models/inspection';

@injectable()
export class InspectionsService {
  private mongoClient: MongoDBClient;

  constructor(
    @inject(TYPES.MongoDBClient) mongoClient: MongoDBClient
  ) {
    this.mongoClient = mongoClient;
  }

  public async getInspections(query: IQuery): Promise<IResponseWithPage<Inspection>> {

    const filter = {}

    if (query.filter_basic !== ""){
      filter["basic"] = query.filter_basic
    }

    const aggregatePipeline = [
      {
        $match: filter,
      },
      {
        $sort: { date: query.sort_order }
      },
      {
        $facet: {
          pages: 
            [
              {
                $count: "total"
              },
              {
                $addFields: {
                  page_size: query.page_size,
                  page_number: query.page_number,
                  total_page: {
                    $ceil :{
                      $divide: ["$total", query.page_size]
                    }
                  }
                }
              }
            ],
          data: 
            [
              {
                $unset:["vins"]
              },
              {
                $skip: query.page_number * query.page_size
              },
              {
                $limit: query.page_size
              },
            ]
        },
      },
      {
        $project: {
          data: 1,
          page: {
            $ifNull: [
              {
                $arrayElemAt: ["$pages", 0]
              },
              null
            ]
          }
        }
      }
    ]

    const data = await this.mongoClient.db.collection(COLLECTIONS.Inspections).aggregate(aggregatePipeline).next()

    return data as IResponseWithPage<Inspection>
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
