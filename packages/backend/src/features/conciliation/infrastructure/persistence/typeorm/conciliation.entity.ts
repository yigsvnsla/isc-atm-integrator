import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ConciliationMatchEntity } from './conciliation-match.entity';

@Entity('conciliations')
export class ConciliationEntity {
    @PrimaryColumn({ name: 'id' })
    public id: string;

    @Column({ name: 'run_at' })
    public runAt: Date;

    @Column({ name: 'status' })
    public status: string;

    @Column({ name: 'summary', type: 'jsonb' })
    public summary: { matched: number; discrepancies: number; missing: number };

    @OneToMany(() => ConciliationMatchEntity, match => match.conciliation)
    public matches?: ConciliationMatchEntity[];
}
