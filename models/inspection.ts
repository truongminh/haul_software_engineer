
export interface Inspection  {
  date: Date;
  state: string;
  vins: string[];
  level: number;
  hm: boolean;
  code: string;
  phm: boolean;
  weight: number;
  _id?: string;
}
