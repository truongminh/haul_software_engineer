import { inject, injectable } from 'inversify';
import { MongoDBClient } from '../infra/mongodb';
import TYPES from '../constant/types';
import COLLECTIONS from '../constant/collection';
import { Summary } from '../models/summary';
import { Violation } from '../models/violation';
import { Inspection } from '../models/inspection';
import { Vehicle } from '../models/vehicle';

export interface InspectionQuery {
  filter_basic: string;
  page_size: number;
  page_number: number;
  sort_by: string;
  sort_order: -1 | 1;
}


export interface InspectionView {
  no: string;
  date: string;
  plate: string;
  basic: string;
  weight: number;
}

export interface InspectionDetail extends Inspection {
  vehicles: Vehicle[];
  violations: Violation[];
}

@injectable()
export class InspectionRepository {
  constructor(
    @inject(TYPES.MongoDBClient) private mongoClient: MongoDBClient
  ) {
  }

  private summaryCollection = this.mongoClient.db.collection<Summary>(COLLECTIONS.Summary);
  private violationCollection = this.mongoClient.db.collection<Violation>(COLLECTIONS.Violation);
  private inspectionCollection = this.mongoClient.db.collection(COLLECTIONS.Inspections);

  private async getFilter(query: InspectionQuery) {
    const filter = {};
    if (!query.filter_basic) {
      return filter;
    }
    const summary = await this.summaryCollection.findOne({ basic: query.filter_basic });
    if (!summary) {
      return filter;
    }
    const violations = await this.violationCollection.find({ code: summary.code }).toArray();
    const ins = violations.map(v => v.ins);
    return { _id: { $in: ins } };
  }

  public async Count(query: InspectionQuery) {
    const filter = await this.getFilter(query);
    const count = await this.mongoClient.db.collection(COLLECTIONS.Inspections).countDocuments(filter);
    return count;
  }

  public async ListInspections(query: InspectionQuery) {
    const filter = await this.getFilter(query);
    const pipeline = [
      { $match: filter },
      {
        $sort: { [query.sort_by]: query.sort_order },
      },
      {
        $skip: (query.page_number - 1) * query.page_size
      },
      {
        $limit: query.page_size
      },
      {
        $lookup: {
          from: COLLECTIONS.Vehicles,
          localField: 'vins',
          foreignField: '_id',
          as: 'vehicles'
        }
      },
      {
        $unwind: {
          path: "$vehicles",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: COLLECTIONS.Violation,
          localField: 'vehicles._id',
          foreignField: 'vin',
          as: 'violation'
        }
      },
      {
        $unwind: {
          path: "$violation",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: COLLECTIONS.Summary,
          localField: 'violation.code',
          foreignField: 'code',
          as: 'summary',
        }
      },
      {
        $unwind: {
          path: "$summary",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          no: "$_id",
          date: "$date",
          vin: "$vehicles._id",
          plate: "$vehicles.license_number",
          weight: "$weight",
          basic: "$summary.basic"
        }
      },
    ]
    const data = await this.inspectionCollection.aggregate<InspectionView>(pipeline).toArray();
    return data;
  }

  public async getInspection(id: string) {
    const pipeline = [
      {
        $match: {
          _id: id
        },
      },
      {
        $lookup: {
          from: COLLECTIONS.Violation,
          localField: '_id',
          foreignField: 'ins',
          as: 'violations'
        }
      },
      {
        $lookup: {
          from: COLLECTIONS.Vehicles,
          localField: 'vins',
          foreignField: '_id',
          as: 'vehicles'
        }
      },
    ];
    const data = await this.inspectionCollection.aggregate<InspectionDetail>(pipeline).toArray();
    return data[0];
  }
}
