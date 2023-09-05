
export interface Inspection  {
  date: Date;
  state: string;
  vins: string[];
  level: number;
  hm: boolean;
  basic: string;
  code: string;
  phm: boolean;
  weight: number;
  _id?: string;
}
