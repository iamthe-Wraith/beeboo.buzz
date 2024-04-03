import { describe, expect, test } from 'vitest';
import { ContextService, type ICreateContextRequest } from './context';
import { ContextRole } from '../../types/contexts';
import { MAX_CONTEXT_DESCRIPTION_LENGTH, MAX_CONTEXT_NAME_LENGTH } from '$lib/constants/context';

describe('services - context', () => {
    describe('isValidContextRequest', () => {
        test('should return no errors if context is valid', () => {
            const context: ICreateContextRequest = {
                name: 'Test Context',
                description: 'This is a test context.',
                role: ContextRole.NONE,
            };

            const errors = ContextService.isValidContextRequest(context);
            expect(errors.length).toEqual(0);
        });

        test('should return error if no name is provided', () => {
            const context = {
                description: 'This is a test context.',
                role: ContextRole.NONE,
            } as unknown as ICreateContextRequest;

            const errors = ContextService.isValidContextRequest(context);
            expect(errors.length).toEqual(1);
            expect(errors[0].message).toEqual('Name is required.');
        });

        test('should return error if name is too long', () => {
            const context = {
                name: 'a'.repeat(MAX_CONTEXT_NAME_LENGTH + 1),
                description: 'This is a test context.',
                role: ContextRole.NONE,
            } as unknown as ICreateContextRequest;

            const errors = ContextService.isValidContextRequest(context);
            expect(errors.length).toEqual(1);
            expect(errors[0].message).toEqual(`Name must be less than ${MAX_CONTEXT_NAME_LENGTH} characters.`);
        });

        test('should return error if description is too long', () => {
            const context = {
                name: 'Test Context',
                description: 'a'.repeat(MAX_CONTEXT_DESCRIPTION_LENGTH + 1),
                role: ContextRole.NONE,
            } as unknown as ICreateContextRequest;

            const errors = ContextService.isValidContextRequest(context);
            expect(errors.length).toEqual(1);
            expect(errors[0].message).toEqual(`Description must be less than ${MAX_CONTEXT_DESCRIPTION_LENGTH} characters.`);
        });

        test('should return error if an no role is provided', () => {
            const context = {
                name: 'Test Context',
                description: 'This is a test context.',
            } as unknown as ICreateContextRequest;

            const errors = ContextService.isValidContextRequest(context);
            expect(errors.length).toEqual(1);
            expect(errors[0].message).toEqual('Role is required.');
        });

        test('should return error if an invalid role is provided', () => {
            const context = {
                name: 'Test Context',
                description: 'This is a test context.',
                role: 'INVALID',
            } as unknown as ICreateContextRequest;

            const errors = ContextService.isValidContextRequest(context);
            expect(errors.length).toEqual(1);
            expect(errors[0].message).toEqual('Invalid role.');
        });
    });
});