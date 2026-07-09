// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
export interface Query<TResult> {}

export interface QueryHandler<TQuery extends Query<unknown>, TResult> {
    execute(query: TQuery): Promise<TResult>;
}
