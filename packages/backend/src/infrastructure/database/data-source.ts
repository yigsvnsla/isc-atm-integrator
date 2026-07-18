import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { PGliteDriver } from 'typeorm-pglite';
import type { PGliteOptions } from '@electric-sql/pglite';
import configuration from '@infrastructure/config/configuration';

import { OrderEntity } from '@features/orders/infrastructure/persistence/typeorm/order.entity';
import { AgreementEntity } from '@features/agreements/infrastructure/persistence/typeorm/agreement.entity';
import { BankAccountEntity } from '@features/accounts/infrastructure/persistence/typeorm/account.entity';
import { TransactionEntity } from '@features/transactions/infrastructure/persistence/typeorm/transaction.entity';
import { AuthUserEntity } from '@features/auth/infrastructure/persistence/typeorm/auth-user.entity';
import { AuthRefreshTokenEntity } from '@features/auth/infrastructure/persistence/typeorm/auth-refresh-token.entity';
import { AuthProfileEntity } from '@features/auth/infrastructure/persistence/typeorm/auth-profile.entity';
import { AuthPermissionEntity } from '@features/auth/infrastructure/persistence/typeorm/auth-permission.entity';
import { UserProfileEntity } from '@features/auth/infrastructure/persistence/typeorm/user-profile.entity';
import { ProfilePermissionEntity } from '@features/auth/infrastructure/persistence/typeorm/profile-permission.entity';
import { ApiKeyEntity } from '@features/auth/infrastructure/persistence/typeorm/api-key.entity';

const cfg = configuration();
const db = cfg.database;

let baseOptions: DataSourceOptions;

if (db.type === 'postgres') {
    baseOptions = {
        type: 'postgres',
        host: db.postgres.host,
        port: db.postgres.port,
        username: db.postgres.username,
        password: db.postgres.password,
        database: db.postgres.name,
        synchronize: db.postgres.synchronize,
    };
} else if (db.type === 'pglite-socket') {
    baseOptions = {
        type: 'postgres',
        host: db.socket.host,
        port: db.socket.port,
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        synchronize: true,
    };
} else {
    const options: PGliteOptions = {};
    if (db.pglite.dataDir) {
        options.dataDir = db.pglite.dataDir;
    }
    baseOptions = {
        type: 'postgres',
        driver: new PGliteDriver(options).driver,
        synchronize: true,
    };
}

const options: DataSourceOptions & SeederOptions = {
    ...baseOptions,
    entities: [
        OrderEntity,
        AgreementEntity,
        BankAccountEntity,
        TransactionEntity,
        AuthUserEntity,
        AuthRefreshTokenEntity,
        AuthProfileEntity,
        AuthPermissionEntity,
        UserProfileEntity,
        ProfilePermissionEntity,
        ApiKeyEntity,
    ],
    migrations: [`${db.migrations.dir}/**/*{.ts,.js}`],
    migrationsTableName: db.migrations.tableName,
    seeds: ['src/infrastructure/database/seeds/**/*{.ts,.js}'],
    factories: ['src/infrastructure/database/factories/**/*{.ts,.js}'],
};

export const dataSource = new DataSource(options);
