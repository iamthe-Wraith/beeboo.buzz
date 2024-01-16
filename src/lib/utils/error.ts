export class ApiError extends Error {
  status = 400;
  field: string | undefined;
  data: Record<string, unknown>;

  constructor(message: string, status: number, field?: string, data?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.field = field;
    this.data = data || {};
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
      field: this.field,
      data: this.data,
    };
  }
}