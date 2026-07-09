export type Command = object;

export interface CommandHandler<TCommand extends Command> {
    execute(command: TCommand): Promise<void>;
}
