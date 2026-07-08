export abstract class AppError {
    public readonly message: string;
    public readonly code: string;

    constructor(message: string, code: string) {
        this.message = message;
        this.code = code;
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 'NOT_FOUND');
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 'VALIDATION');
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 'CONFLICT');
    }
}
