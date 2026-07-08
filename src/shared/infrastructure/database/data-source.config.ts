import { DataSourceOptions } from 'typeorm';

const WRITE_DB_PATH = process.env.DB_WRITE_PATH ?? './data/write.db';
const READ_DB_PATH = process.env.DB_READ_PATH ?? './data/read.db';
const ENTITIES_PATH =
    __dirname +
    '/../../../features/**/infrastructure/persistence/**/*.entity{.ts,.js}';

export const writeDataSourceOptions: DataSourceOptions = {
    type: 'sqljs',
    location: WRITE_DB_PATH,
    autoSave: true,
    entities: [ENTITIES_PATH],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.DB_LOG === 'true',
};

export const readDataSourceOptions: DataSourceOptions = {
    type: 'sqljs',
    location: READ_DB_PATH,
    autoSave: false,
    entities: [ENTITIES_PATH],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.DB_LOG === 'true',
};
