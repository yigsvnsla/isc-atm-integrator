import { ApiTags } from '@nestjs/swagger';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
    Version,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginCommand } from '../application/commands/login/command';
import { LoginResponse } from '../application/commands/login/response.dto';
import { RefreshCommand } from '../application/commands/refresh/command';
import { RefreshResponse } from '../application/commands/refresh/response.dto';
import { GenerateApiKeyCommand } from '../application/commands/generate-api-key/command';
import { GenerateApiKeyResponse } from '../application/commands/generate-api-key/response.dto';
import { RevokeApiKeyCommand } from '../application/commands/revoke-api-key/command';
import { RevokeApiKeyResponse } from '../application/commands/revoke-api-key/response.dto';
import { GetApiKeysQuery } from '../application/queries/get-api-keys/query';
import { GetApiKeysResponse } from '../application/queries/get-api-keys/response.dto';
import { JwtAuthGuard } from '../passport/guards/jwt-auth.guard';
import type { Request, Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Post('login')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    public async login(
        @Body() command: LoginCommand,
        @Res({ passthrough: true }) res: Response,
    ): Promise<LoginResponse> {
        const result = await this.commandBus.execute<LoginResponse>(command);

        res.cookie('__Host-refresh-token', result.data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/api/auth',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return result;
    }

    @Post('refresh')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    public async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<RefreshResponse> {
        const refreshToken =
            req.cookies?.['__Host-refresh-token'] ?? '';

        const result = await this.commandBus.execute<RefreshResponse>(
            new RefreshCommand(refreshToken),
        );

        res.cookie('__Host-refresh-token', result.data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/api/auth',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return result;
    }

    @Post('api-keys')
    @Version('1')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    public async generateApiKey(
        @Body() command: GenerateApiKeyCommand,
    ): Promise<GenerateApiKeyResponse> {
        return this.commandBus.execute<GenerateApiKeyResponse>(command);
    }

    @Get('api-keys')
    @Version('1')
    @UseGuards(JwtAuthGuard)
    public async listApiKeys(
        @Query('agreement_id') agreementId: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ): Promise<GetApiKeysResponse> {
        return this.queryBus.execute<GetApiKeysResponse>(
            new GetApiKeysQuery(agreementId, page ?? 1, limit ?? 10),
        );
    }

    @Delete('api-keys/:id')
    @Version('1')
    @UseGuards(JwtAuthGuard)
    public async revokeApiKey(
        @Param('id') id: string,
    ): Promise<RevokeApiKeyResponse> {
        return this.commandBus.execute<RevokeApiKeyResponse>(
            new RevokeApiKeyCommand(id),
        );
    }
}
