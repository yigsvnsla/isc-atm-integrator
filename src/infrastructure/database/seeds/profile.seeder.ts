import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { AuthProfileEntity } from '@features/auth/infrastructure/persistence/typeorm/auth-profile.entity';
import { AuthPermissionEntity } from '@features/auth/infrastructure/persistence/typeorm/auth-permission.entity';
import { ProfilePermissionEntity } from '@features/auth/infrastructure/persistence/typeorm/profile-permission.entity';
import { randomUUID } from 'node:crypto';

interface SeedPermission {
    resource: string;
    action: string;
    name: string;
}

interface SeedProfile {
    name: string;
    description: string;
    permissions: string[];
}

const PERMISSIONS: SeedPermission[] = [
    { resource: 'agreements', action: 'read', name: 'agreements:read' },
    { resource: 'agreements', action: 'write', name: 'agreements:write' },
    { resource: 'agreements', action: 'delete', name: 'agreements:delete' },
    { resource: 'bank_accounts', action: 'read', name: 'bank_accounts:read' },
    { resource: 'bank_accounts', action: 'write', name: 'bank_accounts:write' },
    { resource: 'bank_accounts', action: 'delete', name: 'bank_accounts:delete' },
    { resource: 'transactions', action: 'read', name: 'transactions:read' },
    { resource: 'transactions', action: 'write', name: 'transactions:write' },
    { resource: 'transactions', action: 'delete', name: 'transactions:delete' },
    { resource: 'api_keys', action: 'read', name: 'api_keys:read' },
    { resource: 'api_keys', action: 'write', name: 'api_keys:write' },
    { resource: 'api_keys', action: 'delete', name: 'api_keys:delete' },
    { resource: 'users', action: 'read', name: 'users:read' },
    { resource: 'users', action: 'write', name: 'users:write' },
    { resource: 'users', action: 'delete', name: 'users:delete' },
    { resource: 'profiles', action: 'read', name: 'profiles:read' },
    { resource: 'profiles', action: 'write', name: 'profiles:write' },
    { resource: 'profiles', action: 'delete', name: 'profiles:delete' },
    { resource: 'permissions', action: 'read', name: 'permissions:read' },
    { resource: 'audit', action: 'read', name: 'audit:read' },
];

const PROFILES: SeedProfile[] = [
    {
        name: 'admin',
        description: 'Full access to all resources',
        permissions: [
            'agreements:read', 'agreements:write', 'agreements:delete',
            'bank_accounts:read', 'bank_accounts:write', 'bank_accounts:delete',
            'transactions:read', 'transactions:write', 'transactions:delete',
            'api_keys:read', 'api_keys:write', 'api_keys:delete',
            'users:read', 'users:write', 'users:delete',
            'profiles:read', 'profiles:write', 'profiles:delete',
            'permissions:read', 'audit:read',
        ],
    },
    {
        name: 'operator',
        description: 'Can process transactions and view accounts',
        permissions: [
            'transactions:write', 'bank_accounts:read', 'agreements:read', 'audit:read',
        ],
    },
    {
        name: 'viewer',
        description: 'Read-only access for audit and reports',
        permissions: [
            'agreements:read', 'bank_accounts:read', 'transactions:read', 'audit:read',
        ],
    },
    {
        name: 'api_client',
        description: 'Machine-to-machine access for ATM networks',
        permissions: [
            'transactions:write', 'bank_accounts:read', 'agreements:read',
        ],
    },
];

export default class ProfileSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        _factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const profileRepo = dataSource.getRepository(AuthProfileEntity);
        const permRepo = dataSource.getRepository(AuthPermissionEntity);
        const ppRepo = dataSource.getRepository(ProfilePermissionEntity);

        const existingProfiles = await profileRepo.count();
        if (existingProfiles > 0) {
            console.log('Profiles already seeded. Skipping.');
            return;
        }

        for (const perm of PERMISSIONS) {
            await permRepo.save({
                id: randomUUID(),
                resource: perm.resource,
                action: perm.action,
                name: perm.name,
                createdAt: new Date(),
            });
        }
        console.log(`Seeded ${PERMISSIONS.length} permissions.`);

        const allPerms = await permRepo.find();
        const permMap = new Map(allPerms.map((p) => [p.name, p.id]));

        for (const profileData of PROFILES) {
            const profile = await profileRepo.save({
                id: randomUUID(),
                name: profileData.name,
                description: profileData.description,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            for (const permName of profileData.permissions) {
                const permId = permMap.get(permName);
                if (!permId) continue;
                await ppRepo.save({
                    profileId: profile.id,
                    permissionId: permId,
                });
            }
        }

        console.log(`Seeded ${PROFILES.length} profiles with permissions.`);
    }
}
