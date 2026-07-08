import type { AppError } from './errors';
import type { Result } from './result';

export type CommandResult<T> = Result<T, AppError>;
export type QueryResult<T> = Result<T, AppError>;
