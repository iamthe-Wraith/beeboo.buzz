import { describe, expect, test } from 'vitest';
import { isValidNewProjectRequest, type ICreateProjectRequest, isValidUpdateProjectRequest, type IUpdateProjectRequest } from './project';
import { HttpStatus } from '$lib/constants/error';
import { MAX_PROJECT_TITLE_LENGTH } from '$lib/constants/project';

describe('services - project', () => {
    describe('isValidNewProjectRequest', () => {
        test('should return no errors for valid project', () => {
            const project = {
                title: 'Test Project',
                notes: 'This is a test project.',
            };

            const errors = isValidNewProjectRequest(project);

            expect(errors.length).toBe(0);
        });

        test('should return error if no title is provided', () => {
            const project = {
                notes: 'This is a test project.',
            } as unknown as ICreateProjectRequest;

            const errors = isValidNewProjectRequest(project);

            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('title');
            expect(errors[0].message).toBe('Title is required.');
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });

        test('should return error if title is too long', () => {
            const project = {
                title: 'a'.repeat(MAX_PROJECT_TITLE_LENGTH + 1),
                notes: 'This is a test project.',
            } as unknown as ICreateProjectRequest;

            const errors = isValidNewProjectRequest(project);

            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('title');
            expect(errors[0].message).toBe(`Title must be less than ${MAX_PROJECT_TITLE_LENGTH} characters.`);
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });
    });

    describe('isValidUpdateTaskRequest', () => {
        test('should return no errors for valid project', () => {
            const project = {
                id: 123,
                title: 'Test Project',
                notes: 'This is a test project.',
                completed: false,
            };

            const errors = isValidUpdateProjectRequest(project);

            expect(errors.length).toBe(0);
        });

        test('should return error if no updatable data is provided', () => {
            const project = {
                id: 123,
            } as unknown as IUpdateProjectRequest;

            const errors = isValidUpdateProjectRequest(project);

            expect(errors.length).toBe(1);
            expect(errors[0].field).toBeUndefined();
            expect(errors[0].message).toBe('No updatable data received.');
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });

        test('should return error if no id is provided', () => {
            const project = {
                title: 'Test Project',
                notes: 'This is a test project.',
                completed: false,
            } as unknown as IUpdateProjectRequest;

            const errors = isValidUpdateProjectRequest(project);

            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('id');
            expect(errors[0].message).toBe('Project id is required.');
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });

        test('should return error if no title is provided', () => {
            const project = {
                id: 123,
                notes: 'This is a test project.',
                completed: false,
            } as unknown as IUpdateProjectRequest;

            const errors = isValidUpdateProjectRequest(project);

            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('title');
            expect(errors[0].message).toBe('Title is required.');
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });

        test('should return error if title is too long', () => {
            const project = {
                id: 123,
                title: 'a'.repeat(MAX_PROJECT_TITLE_LENGTH + 1),
                notes: 'This is a test project.',
                completed: false,
            } as unknown as IUpdateProjectRequest;

            const errors = isValidUpdateProjectRequest(project);

            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('title');
            expect(errors[0].message).toBe(`Title must be less than ${MAX_PROJECT_TITLE_LENGTH} characters.`);
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });

        test('should return error if no completed status is provided', () => {
            const project = {
                id: 123,
                title: 'Test Project',
                notes: 'This is a test project.',
            } as unknown as IUpdateProjectRequest;

            const errors = isValidUpdateProjectRequest(project);

            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('completed');
            expect(errors[0].message).toBe('Completed status is required.');
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });

        test('should return error if invalid completed status is found', () => {
            const project = {
                id: 123,
                title: 'Test Project',
                notes: 'This is a test project.',
                completed: 'invalid',
            } as unknown as IUpdateProjectRequest;

            const errors = isValidUpdateProjectRequest(project);

            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('completed');
            expect(errors[0].message).toBe('Invalid completed value received.');
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });
    });
});