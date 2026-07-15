import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IAgreementRepository } from '@features/agreements/domain/agreement.repository';
import { Agreement } from '@features/agreements/domain/agreement';
import { AgreementEntity } from './agreement.entity';

export class TypeormAgreementRepository implements IAgreementRepository {
    public constructor(
        @InjectRepository(AgreementEntity)
        private readonly repo: Repository<AgreementEntity>,
    ) {}

    public async save(agreement: Agreement): Promise<AgreementEntity> {
        const result = await this.repo.save(agreement);
        return result;
    }

    public async findById(id: string): Promise<AgreementEntity | null> {
        const result = await this.repo.findOneBy({ id });
        return result;
    }

    public async findAll(page: number, limit: number, state?: string) {
        const skip = (page - 1) * limit;
        const where: Record<string, unknown> = {};
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
