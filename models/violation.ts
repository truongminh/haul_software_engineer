import { ObjectId } from 'bson';
import { injectable } from 'inversify';

interface IViolation {
  code: string;
  ins: string;
  oss: boolean;
  unit: string;
  vin: string;
  _id?: ObjectId;
}

@injectable()
export class Violation implements IViolation {
  constructor(
    public code: string,
    public ins: string,
    public oss: boolean,
    public unit: string,
    public vin: string,
    public _id?: ObjectId,
  ) { }
}
