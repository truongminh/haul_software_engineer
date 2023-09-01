import { ObjectId } from 'bson';
import { injectable } from 'inversify';

interface IInspection  {
  date: Date;
  state: string;
  vins: string[];
  level: number;
  hm: boolean;
  basic: string;
  code: string;
  phm: boolean;
  weight: number;
  _id?: ObjectId;
}

@injectable()
export class Inspection implements IInspection {
  constructor(
    public date: Date,
    public state: string,
    public vins: string[],
    public level: number,
    public hm: boolean,
    public basic: string,
    public code: string,
    public phm: boolean,
    public weight: number,
    public  _id?: ObjectId,
  ) { }
}
