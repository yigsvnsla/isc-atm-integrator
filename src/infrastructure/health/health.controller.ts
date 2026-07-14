import { Controller, Get } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService,
    TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis.health';

@Controller('health')
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly db: TypeOrmHealthIndicator,
        private readonly redis: RedisHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    public check() {
        return this.health.check([
            () => this.db.pingCheck('database'),
            () => this.redis.isHealthy(),
        ]);
    }

    @Get('readiness')
    @HealthCheck()
    public readiness() {
        return this.health.check([
            () => this.db.pingCheck('database'),
            () => this.redis.isHealthy(),
        ]);
    }

    @Get('liveness')
    @HealthCheck()
    public liveness() {
        return this.health.check([]);
    }
}
