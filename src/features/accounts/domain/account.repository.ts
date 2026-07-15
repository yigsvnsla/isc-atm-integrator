import { AccountEntity } from '../infrastructure/persistence/typeorm/account.entity';
import { Account } from './account';

export const ACCOUNT_REPOSITORY = Symbol('ACCOUNT_REPOSITORY');

export interface IAccountRepository {
    save(account: Account): Promise<AccountEntity>;
    findById(id: string): Promise<AccountEntity | null>;
    findAll(
        page: number,
        limit: number,
        agreementId?: string,
        type?: string,
        state?: string,
    ): Promise<{
        items: AccountEntity[];
        total: number;
        page: number;
        limit: number;
    }>;
}
