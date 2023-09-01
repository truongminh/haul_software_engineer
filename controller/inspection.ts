
import {
  controller, httpGet
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request } from 'express';
import { InspectionsService } from '../service/inspection';
import TYPES from '../constant/types';
import { Inspection } from '../models/inspection';
import { NewQuery, ResponseWithPage } from '../models/page';

@controller('/inspection')
export class InspectionController {

  constructor( @inject(TYPES.InspectionService) private service: InspectionsService) { }

  @httpGet('/')
  public getInspections(request: Request): Promise<ResponseWithPage<Inspection>> {
    return this.service.getInspections(NewQuery(request));
  }

  @httpGet('/:id')
  public getInspection(request: Request): Promise<Object> {
    return this.service.getInspection(request.params.id);
  }
}
