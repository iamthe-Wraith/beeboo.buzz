import { describe, expect, test } from 'vitest';
import { ApiError } from './api-error';

describe('utils - api-error', () => {
    test('should create a new ApiError', async () => {
        const error = new ApiError('this is just a test', 500);

        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toBe('this is just a test');
        expect(error.statusCode).toBe(500);
        expect(error.field).toBeUndefined();
        expect(error.data).toEqual({});
    });

    test('should create a new ApiError with a field', async () => {
        const error = new ApiError('this is just a test', 500, 'email');

        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toBe('this is just a test');
        expect(error.statusCode).toBe(500);
        expect(error.field).toBe('email');
        expect(error.data).toEqual({});
    });

    test('should create a new ApiError with data', async () => {
        const error = new ApiError('this is just a test', 500, undefined, { foo: 'bar' });

        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toBe('this is just a test');
        expect(error.statusCode).toBe(500);
        expect(error.field).toBeUndefined();
        expect(error.data).toEqual({ foo: 'bar' });
    });

    test('should create a new ApiError with a field and data', async () => {
        const error = new ApiError('this is just a test', 500, 'email', { foo: 'bar' });

        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toBe('this is just a test');
        expect(error.statusCode).toBe(500);
        expect(error.field).toBe('email');
        expect(error.data).toEqual({ foo: 'bar' });
    });

    test('should return JSON representation of ApiError', () => {
        const error = new ApiError('this is just a test', 500, 'email', { foo: 'bar' });

        expect(error.toJSON()).toEqual({
            statusCode: 500,
            message: 'this is just a test',
            field: 'email',
            data: { foo: 'bar' },
        });
    });

    test('should parse an ApiError', () => {
        const error = new ApiError('this is just a test', 500, 'email', { foo: 'bar' });

        expect(ApiError.parse(error)).toEqual(error);
    });

    test('should parse an Error', () => {
        const error = new Error('this is just a test');

        expect(ApiError.parse(error)).toEqual(new ApiError('this is just a test', 500));
    });

    test('should parse an array of Errors', () => {
        const error = new Error('this is just a test');

        expect(ApiError.parse([error, error])).toEqual([new ApiError('this is just a test', 500), new ApiError('this is just a test', 500)]);
    });

    test('should parse an array of mixed Errors and ApiErrors', () => {
        const error = new Error('this is just a test');

        expect(ApiError.parse([error, new ApiError('this is just a test', 500)])).toEqual([new ApiError('this is just a test', 500), new ApiError('this is just a test', 500)]);
    });
})