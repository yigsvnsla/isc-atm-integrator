import { ValidationPipe } from '@nestjs/common';

export const validationsSetup = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
});
