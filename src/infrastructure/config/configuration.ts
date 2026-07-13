export default () => ({
    app: {
        isDevMode: process.env.NODE_ENV === 'development',
    },

    server: {
        port: parseInt(String(process.env.APP_SERVER_PORT), 10) || 7000,
        prefix: String(process.env.APP_SERVER_PREFIX ?? '/api'),
    },

    cache: {
        redis: {
            host: String(
                process.env.APP_CACHE_REDIS_HOST ?? 'redis://localhost:6379',
            ),

            ttl:
                parseInt(String(process.env.APP_CACHE_REDIS_TTL), 10) || 60_000,
        },
    },
});
