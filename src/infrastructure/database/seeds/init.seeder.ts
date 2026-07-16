import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import ProfileSeeder from './profile.seeder';
import AdminUserSeeder from './admin-user.seeder';
import AgreementSeeder from './agreement.seeder';
import BankAccountSeeder from './bank-account.seeder';

export default class InitSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        console.log('Starting database seed...');

        await new ProfileSeeder().run(dataSource, factoryManager);
        await new AdminUserSeeder().run(dataSource, factoryManager);
        await new AgreementSeeder().run(dataSource, factoryManager);
        await new BankAccountSeeder().run(dataSource, factoryManager);

        console.log('Database seed complete.');
    }
}
