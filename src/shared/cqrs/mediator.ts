import { Injectable } from '@nestjs/common';
import type { Command, CommandHandler } from '@cqrs/command';
import type { Query, QueryHandler } from '@cqrs/query';

type CommandCtor<T extends Command> = new (...args: never[]) => T;

type QueryCtor<T extends Query<unknown>> = new (...args: never[]) => T;

type AnyCommandHandler = CommandHandler<Command, unknown>;

@Injectable()
export class Mediator {
    private readonly commands = new Map<
        CommandCtor<Command>,
        AnyCommandHandler
    >();
    private readonly queries = new Map<
        QueryCtor<Query<unknown>>,
        QueryHandler<Query<unknown>, unknown>
    >();

    public registerCommand<TCommand extends Command, TResult = void>(
        type: CommandCtor<TCommand>,
        handler: CommandHandler<TCommand, TResult>,
    ): void {
        this.commands.set(type, handler);
    }

    public registerQuery<TQuery extends Query<TResult>, TResult>(
        type: QueryCtor<TQuery>,
        handler: QueryHandler<TQuery, TResult>,
    ): void {
        this.queries.set(type, handler);
    }

    public async send<TCommand extends Command, TResult = void>(
        command: TCommand,
    ): Promise<TResult> {
        const { constructor } = Object.getPrototypeOf(command) as {
            constructor: CommandCtor<Command>;
        };
        const handler = this.commands.get(constructor);
        if (!handler) {
            throw new Error(
                `No handler registered for command ${constructor.name}`,
            );
        }
        return (await handler.execute(command)) as TResult;
    }

    public async ask<TQuery extends Query<TResult>, TResult>(
        query: TQuery,
    ): Promise<TResult> {
        const { constructor } = Object.getPrototypeOf(query) as {
            constructor: QueryCtor<Query<unknown>>;
        };
        const handler = this.queries.get(constructor);
        if (!handler) {
            throw new Error(
                `No handler registered for query ${constructor.name}`,
            );
        }
        return (await handler.execute(query)) as TResult;
    }
}
