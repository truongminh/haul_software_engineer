import { config } from 'dotenv';

export interface IConfig {
    connection_string: string
    db_name: string
}

export const readConfig = () => {
    config();
    const c: IConfig = {
        connection_string: process.env.DB_URL,
        db_name: process.env.DB_NAME,
    }
    console.log(c);
    return c;
}
