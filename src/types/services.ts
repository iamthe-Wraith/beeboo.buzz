export interface IServiceResponse<T = unknown> {
    success: boolean;
    statusCode?: number;
    data?: T;
    errors?: Record<string, string>;
}