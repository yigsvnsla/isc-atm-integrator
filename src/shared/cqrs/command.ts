// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Command {}

export function isCommand(value: unknown): value is Command {
    return typeof value === 'object' && value !== null;
}
