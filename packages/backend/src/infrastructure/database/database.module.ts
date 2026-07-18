import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { PGliteDriver } from 'typeorm-pglite';
import type { PGliteOptions } from '@electric-sql/pglite';
import type { AppConfigService } from '@shared/core/types';

@Module({})
export class DatabaseModule {
    static forRoot(): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [
                TypeOrmModule.forRootAsync({
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => {
                        const cfg =
                            configService as unknown as AppConfigService;
                        const type = cfg.get('database.type', {
                            infer: true,
                        });

                        if (type === 'postgres') {
                            const pg = cfg.get('database.postgres', {
                                infer: true,
                            });
                            const isDev = cfg.get('app.isDevMode', {
                                infer: true,
                            });
                            return {
                                type: 'postgres' as const,
                                host: pg.host,
                                port: pg.port,
                                username: pg.username,
                                password: pg.password,
                                database: pg.name,
                                autoLoadEntities: true,
                                synchronize: isDev,
                                migrations: [
                                    `${cfg.get('database.migrations.dir', { infer: true })}/**/*{.ts,.js}`,
                                ],
                                migrationsTableName: cfg.get(
                                    'database.migrations.tableName',
                                    { infer: true },
                                ),
                            };
                        }

                        if (type === 'pglite-socket') {
                            const socket = cfg.get('database.socket', {
                                infer: true,
                            });
                            return {
                                type: 'postgres' as const,
                                host: socket.host,
                                port: socket.port,
                                username: 'postgres',
                                password: 'postgres',
                                database: 'postgres',
                                autoLoadEntities: true,
                                synchronize: true,
                            };
                        }

                        const pglite = cfg.get('database.pglite', {
                            infer: true,
                        });
                        const options: PGliteOptions = {};
                        if (pglite.dataDir) {
                            options.dataDir = pglite.dataDir;
                        }
                        return {
                            type: 'postgres' as const,
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
