import { describe, expect, test } from "vitest";
import { ApiResponse } from "./api-response";
import { ApiError } from "./api-error";

describe("api-response", () => {
    test("should create a new success ApiResponse", async () => {
        const response = new ApiResponse({ data: { foo: "bar" } });

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(ApiResponse);
        expect(response.statusCode).toBe(200);
        expect(response.success).toBe(true);
        expect(response.data).toEqual({ foo: "bar" });
        expect(response.errors).toEqual(null);
    });

    test("should create a new success ApiResponse with a status code", async () => {
        const response = new ApiResponse({ data: { foo: "bar" }, statusCode: 201 });

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(ApiResponse);
        expect(response.statusCode).toBe(201);
        expect(response.success).toBe(true);
        expect(response.data).toEqual({ foo: "bar" });
        expect(response.errors).toEqual(null);
    });

    test("should create a new error ApiResponse", async () => {
        const response = new ApiResponse({ errors: new Error("this is just a test") });

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(ApiResponse);
        expect(response.statusCode).toBe(500);
        expect(response.success).toBe(false);
        expect(response.data).toEqual({});
        expect(response.errors).toEqual({ statusCode: 500, message: "this is just a test", field: undefined, data: {} });
    });

    test("should create a new error ApiResponse with a status code", async () => {
        const response = new ApiResponse({ errors: new Error("this is just a test"), statusCode: 400 });

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(ApiResponse);
        expect(response.statusCode).toBe(400);
        expect(response.success).toBe(false);
        expect(response.data).toEqual({});
        expect(response.errors).toEqual({ statusCode: 500, message: "this is just a test", field: undefined, data: {} });
    });

    test("should create a new error ApiResponse with an ApiError", async () => {
        const response = new ApiResponse({ errors: new ApiError("this is just a test", 409) });

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(ApiResponse);
        expect(response.statusCode).toBe(409);
        expect(response.success).toBe(false);
        expect(response.data).toEqual({});
        expect(response.errors).toEqual({ statusCode: 409, message: "this is just a test", field: undefined, data: {} });
    });

    test("should create a new error ApiResponse with an ApiError with a field", async () => {
        const response = new ApiResponse({ errors: new ApiError("this is just a test", 409, "email") });

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(ApiResponse);
        expect(response.statusCode).toBe(409);
        expect(response.success).toBe(false);
        expect(response.data).toEqual({});
        expect(response.errors).toEqual({ statusCode: 409, message: "this is just a test", field: "email", data: {} });
    });

    test("should create a new error ApiResponse with an ApiError with data", async () => {
        const response = new ApiResponse({ errors: new ApiError("this is just a test", 409, undefined, { foo: "bar" }) });

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(ApiResponse);
        expect(response.statusCode).toBe(409);
        expect(response.success).toBe(false);
        expect(response.data).toEqual({});
        expect(response.errors).toEqual({ statusCode: 409, message: "this is just a test", field: undefined, data: { foo: "bar" } });
    });

    test("should create a new error ApiResponse with an ApiError with a field and data", async () => {
        const response = new ApiResponse({ errors: new ApiError("this is just a test", 409, "email", { foo: "bar" }) });

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(ApiResponse);
        expect(response.statusCode).toBe(409);
        expect(response.success).toBe(false);
        expect(response.data).toEqual({});
        expect(response.errors).toEqual({ statusCode: 409, message: "this is just a test", field: "email", data: { foo: "bar" } });
    });

    test("should create a new error ApiResponse with an array of ApiErrors", async () => {
        const response = new ApiResponse({ errors: [new ApiError("this is just a test", 409), new ApiError("this is just a test", 409)] });

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(ApiResponse);
        expect(response.statusCode).toBe(409);
        expect(response.success).toBe(false);
        expect(response.data).toEqual({});
        expect(response.errors).toEqual([{ statusCode: 409, message: "this is just a test", field: undefined, data: {} }, { statusCode: 409, message: "this is just a test", field: undefined, data: {} }]);
    });

    test("should create a new error ApiResponse with an array of ApiErrors with a field", async () => {
        const response = new ApiResponse({ errors: [new ApiError("this is just a test", 409, "email"), new ApiError("this is just a test", 409, "email")] });

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(ApiResponse);
        expect(response.statusCode).toBe(409);
        expect(response.success).toBe(false);
        expect(response.data).toEqual({});
        expect(response.errors).toEqual([{ statusCode: 409, message: "this is just a test", field: "email", data: {} }, { statusCode: 409, message: "this is just a test", field: "email", data: {} }]);
    });

    test("should create a new error ApiResponse with an array of ApiErrors with data", async () => {
        const response = new ApiResponse({ errors: [new ApiError("this is just a test", 409, undefined, { foo: "bar" }), new ApiError("this is just a test", 409, undefined, { foo: "bar" })] });

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(ApiResponse);
        expect(response.statusCode).toBe(409);
        expect(response.success).toBe(false);
        expect(response.data).toEqual({});
        expect(response.errors).toEqual([{ statusCode: 409, message: "this is just a test", field: undefined, data: { foo: "bar" } }, { statusCode: 409, message: "this is just a test", field: undefined, data: { foo: "bar" } }]);
    });

    test("should create a new error ApiResponse with an array of ApiErrors with a field and data", async () => {
        const response = new ApiResponse({ errors: [new ApiError("this is just a test", 409, "email", { foo: "bar" }), new ApiError("this is just a test", 409, "email", { foo: "bar" })] });

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(ApiResponse);
        expect(response.statusCode).toBe(409);
        expect(response.success).toBe(false);
        expect(response.data).toEqual({});
        expect(response.errors).toEqual([{ statusCode: 409, message: "this is just a test", field: "email", data: { foo: "bar" } }, { statusCode: 409, message: "this is just a test", field: "email", data: { foo: "bar" } }]);
    });

    test("should create a new error ApiResponse with an array of mixed errors", async () => {
        const response = new ApiResponse({ errors: [new ApiError("this is just a test", 409, "email", { foo: "bar" }), new Error("this is just a test")] });

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(ApiResponse);
        expect(response.statusCode).toBe(500);
        expect(response.success).toBe(false);
        expect(response.data).toEqual({});
        expect(response.errors).toEqual([{ statusCode: 409, message: "this is just a test", field: "email", data: { foo: "bar" } }, { statusCode: 500, message: "this is just a test", field: undefined, data: {} }]);
    });
})