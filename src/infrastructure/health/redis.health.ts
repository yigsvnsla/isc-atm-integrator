import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { HealthIndicatorService } from '@nestjs/terminus';

@Injectable()
export class RedisHealthIndicator {
    private readonly indicatorKey = 'redis';

    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly healthIndicatorService: HealthIndicatorService,
    ) {}

    public async isHealthy() {
        const indicator = this.healthIndicatorService.check(this.indicatorKey);

        try {
            await this.cacheManager.set('health:ping', 'ok', 5_000);
            await this.cacheManager.get('health:ping');

            return indicator.up();
        } catch (error) {
            return indicator.down({
                message: (error as Error).message || 'Redis unreachable',
            });
        }
    }
}
