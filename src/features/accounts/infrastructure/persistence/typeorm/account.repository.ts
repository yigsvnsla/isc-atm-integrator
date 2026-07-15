import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IAccountRepository } from '@features/accounts/domain/account.repository';
import { Account } from '@features/accounts/domain/account';
import { AccountEntity } from './account.entity';

export class TypeormAccountRepository implements IAccountRepository {
    public constructor(
        @InjectRepository(AccountEntity)
        private readonly repo: Repository<AccountEntity>,
    ) {}

    public async save(account: Account): Promise<AccountEntity> {
        const result = await this.repo.save(account);
        return result;
    }

    public async findById(id: string): Promise<AccountEntity | null> {
        const result = await this.repo.findOneBy({ id });
        return result;
    }

    public async findAll(
        page: number,
        limit: number,
        agreementId?: string,
        type?: string,
        state?: string,
    ) {
        const skip = (page - 1) * limit;
        const where: Record<string, unknown> = {};
        if (agreementId) {
            where.agreementId = agreementId;
        }
        if (type) {
            where.type = type;
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
