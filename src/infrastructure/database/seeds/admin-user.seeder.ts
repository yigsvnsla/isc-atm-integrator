import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { AuthUserEntity } from '@features/auth/infrastructure/persistence/typeorm/auth-user.entity';
import { AuthProfileEntity } from '@features/auth/infrastructure/persistence/typeorm/auth-profile.entity';
import { UserProfileEntity } from '@features/auth/infrastructure/persistence/typeorm/user-profile.entity';

export default class AdminUserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        _factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const userRepo = dataSource.getRepository(AuthUserEntity);
        const profileRepo = dataSource.getRepository(AuthProfileEntity);
        const upRepo = dataSource.getRepository(UserProfileEntity);

        const email = process.env.APP_SEED_ADMIN_EMAIL ?? 'admin@atm-integrator.local';
        const existing = await userRepo.findOneBy({ email });
        if (existing) {
            console.log(`Admin user already exists (${email}). Skipping.`);
            return;
        }

        const adminProfile = await profileRepo.findOneBy({ name: 'admin' });
        if (!adminProfile) {
            console.warn('Admin profile not found. Run ProfileSeeder first.');
            return;
        }

        const password = process.env.APP_SEED_ADMIN_PASSWORD ?? 'admin123';
        const passwordHash = await bcrypt.hash(password, 12);

        const user = await userRepo.save({
            id: randomUUID(),
            email,
            passwordHash,
            name: 'System Admin',
            state: 'active',
            agreementId: '00000000-0000-0000-0000-000000000000',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await upRepo.save({
            userId: user.id,
            profileId: adminProfile.id,
        });

        console.log(`Admin user created: ${email}`);
        console.log(`Admin password: ${password}`);
    }
}
