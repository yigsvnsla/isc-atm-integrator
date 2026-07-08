import { Injectable } from '@nestjs/common';
import type { Command } from './command';
import type { Query } from './query';
import type { CommandHandler } from './command-handler';
import type { QueryHandler } from './query-handler';

type CommandCtor<T extends Command> = new (...args: unknown[]) => T;
type QueryCtor<T extends Query<unknown>> = new (...args: unknown[]) => T;

interface CommandBindingEntry {
    readonly ctor: CommandCtor<Command>;
    readonly handler: CommandHandler<Command, unknown>;
}

interface QueryBindingEntry {
    readonly ctor: QueryCtor<Query<unknown>>;
    readonly handler: QueryHandler<Query<unknown>, unknown>;
}

@Injectable()
export class Mediator {
    private readonly commands = new Map<
        CommandCtor<Command>,
        CommandBindingEntry
    >();

    private readonly queries = new Map<
        QueryCtor<Query<unknown>>,
        QueryBindingEntry
    >();

    registerCommand<TCommand extends Command, TResult>(
        type: CommandCtor<TCommand>,
        handler: CommandHandler<TCommand, TResult>,
    ): void {
        this.commands.set(type, {
            ctor: type,
            handler: handler,
        });
    }

    registerQuery<TQuery extends Query<TResult>, TResult>(
        type: QueryCtor<TQuery>,
        handler: QueryHandler<TQuery, TResult>,
    ): void {
        this.queries.set(type, {
            ctor: type,
            handler: handler,
        });
    }

    async send<TCommand extends Command, TResult = void>(
        command: TCommand,
    ): Promise<TResult> {
        const proto = Object.getPrototypeOf(command) as {
            constructor: CommandCtor<Command>;
        };
        const entry = this.commands.get(proto.constructor);

        if (!entry) {
            throw new Error(
                `No handler registered for command ${proto.constructor.name}`,
            );
        }

        return (await entry.handler.execute(command)) as TResult;
    }

    async ask<TQuery extends Query<TResult>, TResult>(
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
