import { ObjectId } from 'bson';
import { injectable } from 'inversify';

interface IVehicle {
  type: string;
  license_state: string;
  license_number: string;
  _id?: ObjectId;
}

@injectable()
export class Vehicle implements IVehicle {
  constructor(
  public  type: string,
  public  license_state: string,
  public  license_number: string,
  public   _id?: ObjectId,
  ) { }
}
