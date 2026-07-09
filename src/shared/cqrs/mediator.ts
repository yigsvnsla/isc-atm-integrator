import type { Command } from './command';
import type { Query } from './query';
import type { CommandHandler } from './command-handler';
import type { QueryHandler } from './query-handler';

type CommandCtor<T extends Command> = new (...args: unknown[]) => T;
type QueryCtor<T extends Query<unknown>> = new (...args: unknown[]) => T;

interface CommandEntry {
    readonly handler: CommandHandler<Command>;
}

interface QueryEntry {
    readonly handler: QueryHandler<Query<unknown>, unknown>;
}

export class Mediator {
    private readonly commands = new Map<CommandCtor<Command>, CommandEntry>();
    private readonly queries = new Map<QueryCtor<Query<unknown>>, QueryEntry>();

    public registerCommand<TCommand extends Command>(
        type: CommandCtor<TCommand>,
        handler: CommandHandler<TCommand>,
    ): void {
        this.commands.set(type, {
            handler: handler,
        });
    }

    public registerQuery<TQuery extends Query<TResult>, TResult>(
        type: QueryCtor<TQuery>,
        handler: QueryHandler<TQuery, TResult>,
    ): void {
        this.queries.set(type, {
            handler: handler,
        });
    }

    public async send<TCommand extends Command>(
        command: TCommand,
    ): Promise<void> {
        const proto = Object.getPrototypeOf(command) as {
            constructor: CommandCtor<Command>;
        };
        const entry = this.commands.get(proto.constructor);

        if (!entry) {
            throw new Error(
                `No handler registered for command ${proto.constructor.name}`,
            );
        }

        await entry.handler.execute(command);
    }

    public async ask<TQuery extends Query<TResult>, TResult>(
        query: TQuery,
    ): Promise<TResult> {
        const proto = Object.getPrototypeOf(query) as {
            constructor: QueryCtor<Query<unknown>>;
        };
        const entry = this.queries.get(proto.constructor);

        if (!entry) {
            throw new Error(
                `No handler registered for query ${proto.constructor.name}`,
            );
        }

        return (await entry.handler.execute(query)) as TResult;
    }
}
