import { describe, test, expect } from 'vitest';
import { validateEmail, validateUsername } from './validators';

describe('validators', () => {
    describe('validateEmail', () => {
        test('returns no error if is valid email', async () => {
            const email = 'test@test.com';

            const validated = validateEmail(email);

            await expect(validated.error).toEqual('');
            await expect(validated.value).toEqual(email);
        });

        test('returns error if no email is provided', async () => {
            const validated = validateEmail('');

            await expect(validated.error).toEqual('Email is required');
            await expect(validated.value).toEqual('');
        });

        test('returns error if invalid email is provided', async () => {
            const email = 'test@test';

            const validated = validateEmail(email);

            await expect(validated.error).toEqual('Invalid email');
            await expect(validated.value).toEqual(email);
        });
    });

    describe('validateUsername', () => {
        test('returns no error if is valid username', async () => {
            const username = 'testUser';

            const validated = validateUsername(username);

            await expect(validated.error).toEqual('');
            await expect(validated.value).toEqual(username);
        });

        test('returns error if no username is provided', async () => {
            const validated = validateUsername('');

            await expect(validated.error).toEqual('Username is required');
            await expect(validated.value).toEqual('');
        });

        test('returns error if invalid username is provided', async () => {
            const username = 'example@';

            const validated = validateUsername(username);

            await expect(validated.error).toEqual('Username must contain only letters, numbers, underscores and hyphens');
            await expect(validated.value).toEqual(username);
        });

        test('returns error if username is too short', async () => {
            const username = 'ex';

            const validated = validateUsername(username);

            await expect(validated.error).toEqual('Username must be at least 3 characters');
            await expect(validated.value).toEqual(username);
        });

        test('returns error if username is too long', async () => {
            const username = 'kjdhflkajhdflkjahdflkjahsdlkfjhaslkdjfhalksjdhflkajshdflkjahdflkjhasdlkjfhaljkdhflkajsdhflkjahsdflkjahsdlkfjhalsjkdfhalkjdhflkasjdhf';

            const validated = validateUsername(username);

            await expect(validated.error).toEqual('Username must be less than 80 characters');
            await expect(validated.value).toEqual(username);
        });
    });
});