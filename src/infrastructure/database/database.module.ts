import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PGliteDriver } from 'typeorm-pglite';
import type { PGliteOptions } from '@electric-sql/pglite';

@Module({})
export class DatabaseModule {
    static forRoot(): DynamicModule {
        const isPostgres = process.env.DB_TYPE === 'postgres';

        if (isPostgres) {
            return {
                module: DatabaseModule,
                imports: [
                    TypeOrmModule.forRootAsync({
                        useFactory: () => ({
                            type: 'postgres',
                            host: process.env.DB_HOST ?? 'localhost',
                            port: Number(process.env.DB_PORT ?? 5432),
                            username: process.env.DB_USERNAME ?? 'postgres',
                            password: process.env.DB_PASSWORD ?? 'postgres',
                            database: process.env.DB_NAME ?? 'isc_atm',
                            autoLoadEntities: true,
                            synchronize: process.env.NODE_ENV !== 'production',
                        }),
                    }),
                ],
            };
        }

        return {
            module: DatabaseModule,
            imports: [
                TypeOrmModule.forRootAsync({
                    useFactory: () => {
                        const options: PGliteOptions = {};
                        if (process.env.PGLITE_DATA_DIR) {
                            options.dataDir = process.env.PGLITE_DATA_DIR;
                        }
                        return {
                            type: 'postgres',
                            driver: new PGliteDriver(options).driver,
                            autoLoadEntities: true,
                            synchronize: true,
                        };
                    },
                }),
            ],
        };
    }
}
