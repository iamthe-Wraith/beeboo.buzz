import type { ApiError } from "$lib/utils/api-error";

export interface IServiceResponse<T = unknown> {
    success: boolean;
    statusCode?: number;
    data?: T;
    errors?: ApiError[];
}