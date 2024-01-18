import type { NumericRange } from "@sveltejs/kit";

export interface IApiError {
  data?: Record<string, unknown>;
  field?: string;
  message: string;
  statusCode: NumericRange<400, 599>;
}

export class ApiError extends Error {
  field: string | undefined;
  data: Record<string, unknown>;
  statusCode: NumericRange<400, 599>;

  constructor(message: string, statusCode: NumericRange<400, 599>, field?: string, data?: Record<string, unknown>) {
    super(message);

    this.field = field;
    this.data = data || {};
    this.statusCode = statusCode;
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      field: this.field,
      data: this.data,
    };
  }

  static parse(error: unknown): ApiError | ApiError[] {
    if (Array.isArray(error)) {
      let errors: ApiError[] = [];

      error.forEach((e) => {
        const parsed = ApiError.parse(e);
        if (Array.isArray(parsed)) {
          errors = errors.concat(parsed);
        } else {
          errors.push(parsed);
        }
      });

      return errors;
    }
    
    if (error instanceof ApiError) return error;

    return new ApiError((error as Error).message, 500);
  }
}