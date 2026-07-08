import { DataSource } from 'typeorm';
import {
    writeDataSourceOptions,
    readDataSourceOptions,
} from './data-source.config';

export const databaseProviders = [
    {
        provide: 'WRITE_DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource(writeDataSourceOptions);
            return dataSource.initialize();
        },
    },
    {
        provide: 'READ_DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource(readDataSourceOptions);
            return dataSource.initialize();
        },
    },
];
