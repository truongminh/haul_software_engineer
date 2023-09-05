interface Violation {
  code: string;
  ins: string;
  oss: boolean;
  unit: string;
  basic: string;
}

interface Vehicle {
  type: string;
  license_state: string;
  license_number: string;
  vin: string;
}

export interface Inspection {
  date: Date;
  state: string;
  vins: string[];
  level: number;
  hm: boolean;
  code: string;
  phm: boolean;
  weight: number;
  no: string;

  violation: Violation;
  vehicle: Vehicle;
}
