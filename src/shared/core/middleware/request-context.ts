import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContextStore {
    requestId: string;
}

const storage = new AsyncLocalStorage<RequestContextStore>();

export function getRequestId(): string | undefined {
    return storage.getStore()?.requestId;
}

export function runWithContext<T>(requestId: string, fn: () => T): T {
    return storage.run({ requestId }, fn);
}
