import { describe, expect, test } from 'vitest';
import { ApiError } from './api-error';
import type { NumericRange } from '@sveltejs/kit';

describe('api-error', () => {
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

    test('should throw error if no message is received', () => {
        expect(() => new ApiError('', 500)).toThrowError('message is required');
    });

    test('should throw error if no status code is received', () => {
        expect(() => new ApiError('this is just a test', undefined as unknown as NumericRange<400, 599>)).toThrowError('status code is required');
    });

    test('should throw error if status code is less than 400', () => {
        expect(() => new ApiError('this is just a test', 399  as unknown as NumericRange<400, 599>)).toThrowError('status code must be between 400 and 599');
    });

    test('should throw error if status code is greater than 599', () => {
        expect(() => new ApiError('this is just a test', 600  as unknown as NumericRange<400, 599>)).toThrowError('status code must be between 400 and 599');
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