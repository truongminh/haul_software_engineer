export interface Violation {
  code: string;
  ins: string;
  oss: boolean;
  unit: string;
  basic: string;
}

export interface Vehicle {
  type: string;
  license_state: string;
  license_number: string;
  vin: string;
}

export interface Inspection {
  date: Date;
  state: string;
  level: number;
  hm: boolean;
  phm: boolean;
  weight: number;
  no: string;
}
