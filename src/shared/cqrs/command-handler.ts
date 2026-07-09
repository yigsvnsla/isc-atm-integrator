import type { Command } from './command';

export interface CommandHandler<TCommand extends Command> {
    execute(command: TCommand): Promise<void>;
}
