import { describe, expect, test } from 'vitest';
import { TaskService, type ICreateTaskRequest, type IUpdateTaskRequest } from './task';
import { HttpStatus } from '$lib/constants/error';
import { MAX_TASK_DESCRIPTION_LENGTH, MAX_TASK_TITLE_LENGTH } from '$lib/constants/task';

describe('services - task', () => {
    describe('isValidNewTaskRequest', () => {
        test('should return no errors for valid task', () => {
            const task = {
                title: 'Test Task',
                description: 'This is a test task.',
                contextId: '123',
                isActive: true,
            } as unknown as ICreateTaskRequest;

            const errors = TaskService.isValidNewTaskRequest(task);

            expect(errors.length).toBe(0);
        });

        test('should return error if no title is provided', () => {
            const task = {
                description: 'This is a test task.',
                contextId: '123',
                isActive: true,
            } as unknown as ICreateTaskRequest;

            const errors = TaskService.isValidNewTaskRequest(task);

            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('title');
            expect(errors[0].message).toBe('Title is required.');
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });

        test('should return error if title is too long', () => {
            const task = {
                title: 'a'.repeat(MAX_TASK_TITLE_LENGTH + 1),
                description: 'This is a test task.',
                contextId: '123',
                isActive: true,
            } as unknown as ICreateTaskRequest;

            const errors = TaskService.isValidNewTaskRequest(task);

            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('title');
            expect(errors[0].message).toBe(`Title must be less than ${MAX_TASK_TITLE_LENGTH} characters.`);
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });

        test('should return error if description is too long', () => {
            const task = {
                title: 'Test Task',
                description: 'a'.repeat(MAX_TASK_DESCRIPTION_LENGTH + 1),
                contextId: '123',
                isActive: true,
            } as unknown as ICreateTaskRequest;

            const errors = TaskService.isValidNewTaskRequest(task);

            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('description');
            expect(errors[0].message).toBe(`Description must be less than ${MAX_TASK_DESCRIPTION_LENGTH} characters.`);
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });

        test('should return error if contextId is not a number', () => {
            const task = {
                title: 'Test Task',
                description: 'This is a test task.',
                contextId: 'abc',
                isActive: true,
            } as unknown as ICreateTaskRequest;

            const errors = TaskService.isValidNewTaskRequest(task);

            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('contextId');
            expect(errors[0].message).toBe('Context id must be a number.');
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });

        test('should return error if isActive is not a boolean', () => {
            const task = {
                title: 'Test Task',
                description: 'This is a test task.',
                contextId: '123',
                isActive: 'true',
            } as unknown as ICreateTaskRequest;

            const errors = TaskService.isValidNewTaskRequest(task);

            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('isActive');
            expect(errors[0].message).toBe('Invalid isActive value received.');
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });

        test('should return no errors if isActive is not provided', () => {
            const task = {
                title: 'Test Task',
                description: 'This is a test task.',
                contextId: '123',
            } as unknown as ICreateTaskRequest;

            const errors = TaskService.isValidNewTaskRequest(task);

            expect(errors.length).toBe(0);
        });
    });

    describe('isValidUpdateTaskRequest', () => {
        test('should return no errors for valid task', () => {
            const task = {
                title: 'Test Task',
                description: 'This is a test task.',
                contextId: '123',
                completed: true,
            } as unknown as IUpdateTaskRequest;

            const errors = TaskService.isValidUpdateTaskRequest(task);

            expect(errors.length).toBe(0);
        });

        test('should return error if no updatable data is provided', () => {
            const task = {} as unknown as IUpdateTaskRequest;

            const errors = TaskService.isValidUpdateTaskRequest(task);

            expect(errors.length).toBe(1);
            expect(errors[0].message).toBe('No updatable data received.');
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });

        test('should return error if title is too long', () => {
            const task = {
                title: 'a'.repeat(MAX_TASK_TITLE_LENGTH + 1),
                description: 'This is a test task.',
                contextId: '123',
                completed: true,
            } as unknown as IUpdateTaskRequest;

            const errors = TaskService.isValidUpdateTaskRequest(task);

            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('title');
            expect(errors[0].message).toBe(`Title must be less than ${MAX_TASK_TITLE_LENGTH} characters.`);
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });

        test('should return error if description is too long', () => {
            const task = {
                title: 'Test Task',
                description: 'a'.repeat(MAX_TASK_DESCRIPTION_LENGTH + 1),
                contextId: '123',
                completed: true,
            } as unknown as IUpdateTaskRequest;

            const errors = TaskService.isValidUpdateTaskRequest(task);

            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('description');
            expect(errors[0].message).toBe(`Description must be less than ${MAX_TASK_DESCRIPTION_LENGTH} characters.`);
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });

        test('should return error if contextId is not a number', () => {
            const task = {
                title: 'Test Task',
                description: 'This is a test task.',
                contextId: 'abc',
                completed: true,
            } as unknown as IUpdateTaskRequest;

            const errors = TaskService.isValidUpdateTaskRequest(task);

            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('contextId');
            expect(errors[0].message).toBe('Context id must be a number.');
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });

        test('should return error if completed is not a boolean', () => {
            const task = {
                title: 'Test Task',
                description: 'This is a test task.',
                contextId: '123',
                completed: 'true',
            } as unknown as IUpdateTaskRequest;

            const errors = TaskService.isValidUpdateTaskRequest(task);

            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('completed');
            expect(errors[0].message).toBe('Invalid completed value received.');
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });

        test('should return error if isActive is not a boolean', () => {
            const task = {
                title: 'Test Task',
                description: 'This is a test task.',
                contextId: '123',
                completed: true,
                isActive: 'true',
            } as unknown as IUpdateTaskRequest;

            const errors = TaskService.isValidUpdateTaskRequest(task);

            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('isActive');
            expect(errors[0].message).toBe('Invalid isActive value received.');
            expect(errors[0].statusCode).toBe(HttpStatus.UNPROCESSABLE);
        });

        test('should return no errors if isActive is not provided', () => {
            const task = {
                title: 'Test Task',
                description: 'This is a test task.',
                contextId: '123',
                completed: true,
            } as unknown as IUpdateTaskRequest;

            const errors = TaskService.isValidUpdateTaskRequest(task);

            expect(errors.length).toBe(0);
        });
    });
});