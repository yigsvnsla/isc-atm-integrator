import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './infrastructure/persistence/typeorm/transaction.entity';
import { TRANSACTION_REPOSITORY } from './domain/transaction.repository';
import { TypeormTransactionRepository } from './infrastructure/persistence/typeorm/transaction.repository';
import { TransactionsController } from './presentation/transactions.controller';
import { CreateTransactionHandler } from './application/commands/create-transaction/handler';
import { TransferHandler } from './application/commands/transfer/handler';
import { UpdateTransactionStateHandler } from './application/commands/update-transaction-state/handler';
import { GetTransactionsHandler } from './application/queries/get-transactions/handler';
import { GetTransactionByIdHandler } from './application/queries/get-transaction-by-id/handler';
import { AccountsModule } from '../accounts/accounts.module';
import { CacheResultService } from '@shared/core/cache/cache-result.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionEntity]),
        CqrsModule,
        AccountsModule,
    ],
    controllers: [TransactionsController],
    providers: [
        {
            provide: TRANSACTION_REPOSITORY,
            useClass: TypeormTransactionRepository,
        },
        CacheResultService,
        CreateTransactionHandler,
        TransferHandler,
        UpdateTransactionStateHandler,
        GetTransactionsHandler,
        GetTransactionByIdHandler,
    ],
})
export class TransactionsModule {}
