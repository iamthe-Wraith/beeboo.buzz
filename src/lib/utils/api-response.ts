import type { NumericRange } from "@sveltejs/kit";
import { ApiError } from "./api-error";

interface IProps<T> {
    statusCode?: NumericRange<200, 599>;
    data?: T;
    errors?: Error | Error[] | ApiError | ApiError[];
}

export class ApiResponse<T> {
    private _data: Record<string, unknown> = {};
    private _errors: ApiError | ApiError[] | null = null;
    private _statusCode: NumericRange<200, 599> | null = null;

    constructor({ data, errors, statusCode }: IProps<T>) {
        if (statusCode) this._statusCode = statusCode;
        if (data) this._data = data;
        if (errors) this._errors = ApiError.parse(errors);
    }

    get statusCode() {
        if (this._statusCode) return this._statusCode;

        if (this._errors instanceof ApiError) return this._errors.statusCode;

        if (Array.isArray(this._errors)) {
            const codes = new Set(this._errors.map((e) => e.statusCode));

            if (codes.size === 1) return this._errors[0].statusCode;

            return (Math.max(...Array.from(codes)) >= 500) ? 500 : 400;
        }

        return 200;
    }

    get success() {
        return !this._errors;
    }

    get data() {
        return this._data;
    }

    get errors() {
        if (!this._errors) return null;

        return this._errors instanceof ApiError
            ? [this._errors.toJSON()]
            : (this._errors as ApiError[]).map((e) => e.toJSON());
    }
}