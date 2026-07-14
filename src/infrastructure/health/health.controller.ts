import { Controller, Get } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import {
    HealthCheck,
    HealthCheckService,
    TypeOrmHealthIndicator,
    type HealthIndicatorResult,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly db: TypeOrmHealthIndicator,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
    ) {}

    @Get()
    @HealthCheck()
    public check() {
        return this.health.check([
            () => this.db.pingCheck('database'),
            async (): Promise<HealthIndicatorResult> =>
                this.cachePingCheck('redis'),
        ]);
    }

    @Get('readiness')
    @HealthCheck()
    public readiness() {
        return this.health.check([
            () => this.db.pingCheck('database'),
            async (): Promise<HealthIndicatorResult> =>
                this.cachePingCheck('redis'),
        ]);
    }

    @Get('liveness')
    @HealthCheck()
    public liveness() {
        return this.health.check([]);
    }

    private async cachePingCheck(key: string): Promise<HealthIndicatorResult> {
        try {
            await this.cache.set('health:ping', 'ok', 5_000);
            await this.cache.get('health:ping');
            return { [key]: { status: 'up' } };
        } catch {
            return {
                [key]: { status: 'down', message: 'Redis unreachable' },
            };
        }
    }
}
