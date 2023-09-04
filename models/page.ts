import { Request } from 'express';
import { injectable } from 'inversify';


export interface IQueryPaging {
  page_size: number;
  page_number: number;
}

export interface IPage extends IQueryPaging {
  total: number;
  total_page: number;
}

export interface IResponseWithPage<T> {
  data: T[]
  page: IPage
}

export interface IQuery extends IQueryPaging{
  sort_by: string
  sort_order: number
  filter_basic: string
}

@injectable()
export class ResponseWithPage<T> implements IResponseWithPage<T> {
  constructor(
    public data: T[],
    public page: IPage,
  ) { }
}



export function NewQuery(request: Request): IQuery {
  const { page_size, page_number, sort_by, sort_order, basic } = request.query

  const pageSize = parseInt(page_size as string, 10)
  const pageNumber = parseInt(page_number as string, 10)

  let sortOrder = -1
  if (sort_order === "ascending") {
    sortOrder = 1
  }

  return {
    page_size: pageSize,
    page_number: pageNumber,
    sort_by: sort_by as string,
    sort_order: sortOrder,
    filter_basic: basic
  } as IQuery
}