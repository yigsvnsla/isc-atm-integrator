import type { Query } from './query';

export interface QueryHandler<TQuery extends Query<unknown>, TResult> {
    execute(query: TQuery): Promise<TResult>;
}
