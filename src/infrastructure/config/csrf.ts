import { INestApplication, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigGetOptions, ConfigService } from '@nestjs/config';
import { doubleCsrf } from 'csrf-csrf';
import cookieParser from 'cookie-parser';
import type { Request, Response, NextFunction } from 'express';
import type { AppConfigService } from '@shared/core/types';

export function csrfSetup(app: INestApplication) {
    const configGetOptions: ConfigGetOptions = { infer: true };
    const configService = app.get<AppConfigService>(ConfigService);

    const enabled = configService.get('security.csrf.enabled', {
        infer: true,
    });

    if (!enabled) {
        return (_req: Request, _res: Response, next: NextFunction) => next();
    }

    app.use(cookieParser());

    const csrfConfig = configService.get('security.csrf', configGetOptions);

    const appPrefix = configService.get('server.prefix', configGetOptions);
    const isProd = !configService.get('app.isDevMode', configGetOptions);

    const { generateCsrfToken, doubleCsrfProtection: csrfProtection } =
        doubleCsrf({
            size: 32,
            cookieName: csrfConfig.cookieName,
            ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
            cookieOptions: {
                sameSite: 'strict',
                path: '/',
                secure: isProd,
                httpOnly: false,
            },
            getSecret: () => {
                return csrfConfig.secret;
            },
            getSessionIdentifier: (req) => {
                return String(req.ip);
            },
            getCsrfTokenFromRequest: (req) => {
                return String(req.headers?.['x-csrf-token']);
            },
        });

    app.getHttpAdapter().get(
        `${appPrefix}/csrf-token`,
        (req: Request, res: Response) => {
            const token = generateCsrfToken(req, res);
            res.json({ token });
        },
    );

    app.use((req: Request, res: Response, next: NextFunction) => {
        if (
            req.path.startsWith(`${appPrefix}/health`) ||
            req.path.startsWith(`${appPrefix}/csrf-token`)
        ) {
            return next();
        }
        csrfProtection(req, res, (error?: unknown) => {
            if (error) {
                const httpError = error as {
                    statusCode?: number;
                    message?: string;
                };
                next(
                    new HttpException(
                        httpError.message ?? 'CSRF validation failed',
                        httpError.statusCode ?? HttpStatus.FORBIDDEN,
                    ),
                );
                return;
            }
            next();
        });
    });

    return csrfProtection;
}
