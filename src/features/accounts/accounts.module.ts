import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './infrastructure/persistence/typeorm/account.entity';
import { ACCOUNT_REPOSITORY } from './domain/account.repository';
import { TypeormAccountRepository } from './infrastructure/persistence/typeorm/account.repository';
import { AccountsController } from './presentation/accounts.controller';
import { CreateAccountHandler } from './application/commands/create-account/handler';
import { GetAccountsHandler } from './application/queries/get-accounts/handler';
import { GetAccountByIdHandler } from './application/queries/get-account-by-id/handler';
import { AgreementsModule } from '../agreements/agreements.module';
import { CacheResultService } from '@shared/core/cache/cache-result.service';

@Module({
    imports: [TypeOrmModule.forFeature([AccountEntity]), CqrsModule, AgreementsModule],
    controllers: [AccountsController],
    providers: [
        { provide: ACCOUNT_REPOSITORY, useClass: TypeormAccountRepository },
        CacheResultService,
        CreateAccountHandler,
        GetAccountsHandler,
        GetAccountByIdHandler,
    ],
    exports: [ACCOUNT_REPOSITORY],
})
export class AccountsModule {}
