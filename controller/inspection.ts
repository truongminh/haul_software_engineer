import {
  controller, httpGet
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request } from 'express';
import { InspectionQuery, InspectionRepository } from '../repo/inspection';
import TYPES from '../constant/types';

@controller('/inspection')
export class InspectionController {

  constructor(@inject(TYPES.InspectionRepo) private repo: InspectionRepository) { }

  @httpGet('/')
  public async getInspections(request: Request) {
    const { page_size, page_number, sort_order, basic } = request.query
    const pageSize = parseInt(page_size as string, 10) || 10;
    const pageNumber = parseInt(page_number as string, 10) || 1;
    const sortOrder = (sort_order === "desc") ? -1 : 1;
    const sortBy = (request.query.sort_by as string) || "date";
    const query: InspectionQuery = {
      page_size: pageSize,
      page_number: pageNumber,
      sort_by: sortBy,
      sort_order: sortOrder,
      filter_basic: basic as string,
    };
    const [data, count] = await Promise.all([
      this.repo.ListInspections(query),
      this.repo.Count(query)
    ]);;
    return {
      data,
      meta: {
        count,
        ...query
      }
    };
  }

  @httpGet('/:id')
  public getInspection(request: Request): Promise<Object> {
    return this.repo.getInspection(request.params.id);
  }
}
