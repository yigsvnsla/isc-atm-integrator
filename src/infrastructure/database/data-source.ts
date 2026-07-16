import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { PGliteDriver } from 'typeorm-pglite';
import type { PGliteOptions } from '@electric-sql/pglite';

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

const isPostgres = process.env.DB_TYPE === 'postgres';

const baseOptions: DataSourceOptions = isPostgres
    ? {
          type: 'postgres',
          host: process.env.DB_HOST ?? 'localhost',
          port: Number(process.env.DB_PORT ?? 5432),
          username: process.env.DB_USERNAME ?? 'postgres',
          password: process.env.DB_PASSWORD ?? 'postgres',
          database: process.env.DB_NAME ?? 'isc_atm',
          synchronize: process.env.NODE_ENV !== 'production',
      }
    : {
          type: 'postgres',
          driver: new PGliteDriver({} as PGliteOptions).driver,
          synchronize: true,
      };

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
    seeds: ['src/infrastructure/database/seeds/**/*{.ts,.js}'],
    factories: ['src/infrastructure/database/factories/**/*{.ts,.js}'],
};

export const dataSource = new DataSource(options);
