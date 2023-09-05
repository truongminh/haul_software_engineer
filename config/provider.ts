import TYPES from "../constant/types";
import { readFileSync } from 'fs';

export interface IConfig {
  connection_string: string
  db_name: string
}

export const ConfigProvider = {
  provide: TYPES.Config,
  useFactory: () => {
    const rawConfig = readFileSync('config.json', 'utf-8');
    return JSON.parse(rawConfig) as IConfig;
  },
};
