import {
  controller, httpGet
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request } from 'express';
import { InspectionsService } from '../service/inspection';
import TYPES from '../constant/types';
import { IResponseWithPage, NewQuery } from '../models/page';
import { Inspection } from '../models/inspection';

@controller('/inspection')
export class InspectionController {

  constructor( @inject(TYPES.InspectionService) private service: InspectionsService) { }

  @httpGet('/')
  public getInspections(request: Request): Promise<IResponseWithPage<Inspection>> {
    return this.service.getInspections(NewQuery(request));
  }

  @httpGet('/:id')
  public getInspection(request: Request): Promise<Object> {
    return this.service.getInspection(request.params.id);
  }
}
