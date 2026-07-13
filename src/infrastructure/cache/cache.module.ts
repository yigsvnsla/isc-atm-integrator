import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';
import type configuration from '@infrastructure/config/configuration';

type AppConfig = ReturnType<typeof configuration>;

@Module({
    imports: [
        NestCacheModule.registerAsync({
            useFactory: (configService: ConfigService<AppConfig, true>) => {
                const redisHost = configService.get('cache.redis.host', {
                    infer: true,
                });

                const cacheTTL = configService.get('cache.redis.ttl', {
                    infer: true,
                });

                return {
                    stores: [new KeyvRedis(redisHost)],
                    ttl: cacheTTL,
                };
            },
            inject: [ConfigService],
            isGlobal: true,
        }),
    ],
})
export class CacheModule {}
