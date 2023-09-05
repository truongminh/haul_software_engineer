import { inject, injectable } from 'inversify';
import { MongoDBClient } from '../infra/mongodb';
import TYPES from '../constant/types';
import COLLECTIONS from '../constant/collection';
import { Inspection } from '../models/inspection';

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

@injectable()
export class InspectionRepository {
  constructor(
    @inject(TYPES.MongoDBClient) private mongoClient: MongoDBClient
  ) {
  }

  private inspectionCollection = this.mongoClient.db.collection<Inspection>(COLLECTIONS.Inspections);

  private async getFilter(query: InspectionQuery) {
    const filter = {};
    if (query.filter_basic) {
      filter['violation.basic'] = query.filter_basic;
    }
    return filter;
  }

  public async Count(query: InspectionQuery) {
    const filter = await this.getFilter(query);
    const count = await this.inspectionCollection.countDocuments(filter);
    return count;
  }

  public async ListInspections(query: InspectionQuery) {
    const filter = await this.getFilter(query);
    const data = await this.inspectionCollection.find(
      filter,
      {
        sort: { [query.sort_by]: query.sort_order },
        limit: query.page_size,
        skip: (query.page_number - 1) * query.page_size,
      }
    ).toArray();
    const view: InspectionView[] = data.map(d => {
      const no = d.no;
      const date = d.date.toISOString();
      const plate = d.vehicle?.license_number;
      const weight = d.weight;
      const basic = d.violation?.basic;
      return { no, date, plate, weight, basic };
    })
    return view;
  }

  public async getInspection(id: string) {
    const data = await this.inspectionCollection.findOne({ _id: id as any });
    return data[0];
  }
}
