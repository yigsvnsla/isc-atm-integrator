import type { Command } from './command';
import type { Query } from './query';
import type { CommandHandler } from './command-handler';
import type { QueryHandler } from './query-handler';

export interface CommandBinding<TCommand extends Command, TResult = void> {
    command: new (...args: unknown[]) => TCommand;
    handler: new (...args: unknown[]) => CommandHandler<TCommand, TResult>;
}

export interface QueryBinding<TQuery extends Query<TResult>, TResult> {
    query: new (...args: unknown[]) => TQuery;
    handler: new (...args: unknown[]) => QueryHandler<TQuery, TResult>;
}

export interface OrderBindings {
    commands: CommandBinding<Command, unknown>[];
    queries: QueryBinding<Query<unknown>, unknown>[];
}
