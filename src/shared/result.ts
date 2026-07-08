export class Result<Type, Error> {
    private readonly _isSuccess: boolean;
    private readonly _value: Type | null;
    private readonly _error: Error | null;

    private constructor(
        isSuccess: boolean,
        value: Type | null,
        error: Error | null,
    ) {
        this._isSuccess = isSuccess;
        this._value = value;
        this._error = error;
    }

    public static success<Type, Error>(value: Type): Result<Type, Error> {
        return new Result<Type, Error>(true, value, null);
    }

    public static failure<Type, Error>(error: Error): Result<Type, Error> {
        return new Result<Type, Error>(false, null, error);
    }

    public getValue(): Type {
        if (!this._isSuccess || this._value === null) {
            throw new Error('Cannot get the value of a failed result.');
        }
        return this._value;
    }

    public getError(): Error {
        if (!this._isSuccess || this._error === null) {
            throw new Error('Cannot get the error of a successful result.');
        }
        return this._error;
    }

    public isSuccess(): boolean {
        return this._isSuccess;
    }
}
