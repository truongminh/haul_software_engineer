import { readFileSync } from 'fs';

export interface IConfig {
    connection_string: string
    db_name: string
}

export const readConfig = () => {
    const rawConfig = readFileSync('config.json', 'utf-8');
    return JSON.parse(rawConfig) as IConfig;
}
