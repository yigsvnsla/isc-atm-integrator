export class ValidationError extends Error {
    public readonly messages: string[];

    public constructor(messages: string[]) {
        super(messages.join(', '));
        this.name = 'ValidationError';
        this.messages = messages;
    }
}

export class NotFoundError extends Error {
    public readonly resource: string;
    public readonly id: string;

    public constructor(resource: string, id: string) {
        super(`${resource} '${id}' not found`);
        this.name = 'NotFoundError';
        this.resource = resource;
        this.id = id;
    }
}
