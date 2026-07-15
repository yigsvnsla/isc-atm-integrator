import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ITransactionRepository } from '@features/transactions/domain/transaction.repository';
import { Transaction } from '@features/transactions/domain/transaction';
import { TransactionEntity } from './transaction.entity';

export class TypeormTransactionRepository implements ITransactionRepository {
    public constructor(
        @InjectRepository(TransactionEntity)
        private readonly repo: Repository<TransactionEntity>,
    ) {}

    public async save(transaction: Transaction): Promise<TransactionEntity> {
        const result = await this.repo.save(transaction);
        return result;
    }

    public async findById(id: string): Promise<TransactionEntity | null> {
        const result = await this.repo.findOneBy({ id });
        return result;
    }

    public async findAll(
        page: number,
        limit: number,
        accountId?: string,
        correlationId?: string,
        operation?: string,
        state?: string,
    ) {
        const skip = (page - 1) * limit;
        const where: Record<string, unknown> = {};
        if (accountId) {
            where.accountId = accountId;
        }
        if (correlationId) {
            where.correlationId = correlationId;
        }
        if (operation) {
            where.operation = operation;
        }
        if (state) {
            where.state = state;
        }
        const [items, total] = await this.repo.findAndCount({
            skip,
            take: limit,
            where,
        });
        return {
            items,
            total,
            page,
            limit,
        };
    }
}
