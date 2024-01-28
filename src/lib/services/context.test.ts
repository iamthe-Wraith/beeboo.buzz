import { describe, expect, test } from 'vitest';
import { isValidContextRequest, type IContextRequest } from './context';
import { ContextRole } from '@prisma/client';

describe('services - context', () => {
    describe('isValidContextRequest', () => {
        test('should return true for valid context', () => {
            const context: IContextRequest = {
                name: 'Test Context',
                description: 'This is a test context.',
                role: ContextRole.NONE,
            };

            expect(isValidContextRequest(context)).toBe(true);
        });

        test('should return false if no name is provided', () => {
            const context = {
                description: 'This is a test context.',
                role: ContextRole.NONE,
            } as unknown as IContextRequest;

            expect(isValidContextRequest(context)).toBe(false);
        });

        test('should return false if an no role is provided', () => {
            const context = {
                name: 'Test Context',
                description: 'This is a test context.',
            } as unknown as IContextRequest;

            expect(isValidContextRequest(context)).toBe(false);
        });

        test('should return false if an invalid role is provided', () => {
            const context = {
                name: 'Test Context',
                description: 'This is a test context.',
                role: 'INVALID',
            } as unknown as IContextRequest;

            expect(isValidContextRequest(context)).toBe(false);
        });
    });
});