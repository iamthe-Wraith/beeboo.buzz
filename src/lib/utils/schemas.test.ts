import { emailSchema, passwordSchema, usernameSchema } from '$lib/utils/schemas';
import { describe, test, expect } from 'vitest';
import type { SafeParseError } from 'zod';

describe('schemas', () => {
    describe('emailSchema', () => {
        test('valid email', async () => {
            const validated = emailSchema.safeParse('example@test.com');
            await expect(validated.success).toEqual(true);
        });

        test('not a string', async () => {
            const validated = emailSchema.safeParse(1);
            await expect(validated.success).toEqual(false);
            await expect((validated as SafeParseError<string>).error.format()._errors[0]).toEqual('Email must be a string');
        })

        test('missing email', async () => {
            const validated = emailSchema.safeParse('');
            await expect(validated.success).toEqual(false);
            await expect((validated as SafeParseError<string>).error.format()._errors[0]).toEqual('Email is required');
        });

        test('invalid email', async () => {
            const validated = emailSchema.safeParse('invalid');
            await expect(validated.success).toEqual(false);
            await expect((validated as SafeParseError<string>).error.format()._errors[0]).toEqual('Invalid email');
        });

        test('invalid email', async () => {
            const validated = emailSchema.safeParse('invalid@test');
            await expect(validated.success).toEqual(false);
            await expect((validated as SafeParseError<string>).error.format()._errors[0]).toEqual('Invalid email');
        });
    });

    describe('passwordSchema', () => {
        test('valid password', async () => {
            [
                'X9y@bV6wQz',
                'Mn3#Pqasdf877Rt',
                'Hj4!kLm8jkbnO',
                'Zx5$cVb2Wn',
                'Qf6%gH234j1Kl',
                'Er7&yUi8oP',
                'Sw2@aTd3fG',
                'Yh9*mJk4lZ',
                'Av0!bCn5Md',
                'Qe1$rkajhdfljTy7uI',
                'oP3$sWx6Yz',
                'Lv4*cNxpiuhp87Mq',
                'Bt5&gHy8Um',
                'Wn6!jI(*&z9Ko',
                'Fp7#dEs0aR',
                'Gi8$vCf1Tb',
                'Hq9^wEx2Sr',
                'Jt0*Luakj76753yIv',
                'Kp1@mBn4Ow',
                'Lq2#zAkliuy765#$x5Py',
            ].forEach(async (password) => {
                const validated = passwordSchema.safeParse(password);
                await expect(validated.success).toEqual(true);
            })
        });

        test('not a string', async () => {
            const validated = passwordSchema.safeParse(1);
            await expect(validated.success).toEqual(false);
            await expect((validated as SafeParseError<string>).error.format()._errors[0]).toEqual('Password must be a string');
        });

        test('missing password', async () => {
            const validated = passwordSchema.safeParse('');
            await expect(validated.success).toEqual(false);
            await expect((validated as SafeParseError<string>).error.format()._errors[0]).toEqual('Password is required');
        });

        test('invalid password - too short', async () => {
            const validated = passwordSchema.safeParse('1Nv@li');
            await expect(validated.success).toEqual(false);
            await expect((validated as SafeParseError<string>).error.format()._errors[0]).toEqual('Password must be at least 8 characters');
        });

        test('invalid password - too long', async () => {
            const validated = passwordSchema.safeParse('1Nv@lid-ljhabdvouyqwbrvlbqelihslkdmngmerbgljerugtluqjehb&^%janbfnbasdbluyfgabdljhfbjanevlahjebvualydhvblajhsdvKJGFUHJVkhgvfjhgfj');
            await expect(validated.success).toEqual(false);
            await expect((validated as SafeParseError<string>).error.format()._errors[0]).toEqual('Password must be less than 100 characters');
        });

        test('invalid password - no lowercase letter', async () => {
            const validated = passwordSchema.safeParse('PASSWORD123!');
            await expect(validated.success).toEqual(false);
            await expect((validated as SafeParseError<string>).error.format()._errors[0]).toEqual('Password must contain at least one lowercase letter');
        });

        test('invalid password - no capital letter', async () => {
            const validated = passwordSchema.safeParse('password123!');
            await expect(validated.success).toEqual(false);
            await expect((validated as SafeParseError<string>).error.format()._errors[0]).toEqual('Password must contain at least one uppercase letter');
        });

        test('invalid password - no number', async () => {
            const validated = passwordSchema.safeParse('Password!');
            await expect(validated.success).toEqual(false);
            await expect((validated as SafeParseError<string>).error.format()._errors[0]).toEqual('Password must contain at least one number');
        });

        test('invalid password - no special character', async () => {
            const validated = passwordSchema.safeParse('Password123');
            await expect(validated.success).toEqual(false);
            await expect((validated as SafeParseError<string>).error.format()._errors[0]).toEqual('Password must contain at least one special character: !@#$%^&*()_-+={[}]|:;"\'<,>.');
        });
    });

    describe('usernameSchema', () => {
        test('valid username', async () => {
            const validated = usernameSchema.safeParse('example');
            await expect(validated.success).toEqual(true);
        });

        test('not a string', async () => {
            const validated = usernameSchema.safeParse(1);
            await expect(validated.success).toEqual(false);
            await expect((validated as SafeParseError<string>).error.format()._errors[0]).toEqual('Username must be a string');
        });

        test('missing username', async () => {
            const validated = usernameSchema.safeParse('');
            await expect(validated.success).toEqual(false);
            await expect((validated as SafeParseError<string>).error.format()._errors[0]).toEqual('Username is required');
        });

        test('invalid username', async () => {
            const validated = usernameSchema.safeParse('in');
            await expect(validated.success).toEqual(false);
            await expect((validated as SafeParseError<string>).error.format()._errors[0]).toEqual('Username must be at least 3 characters');
        });
    });
});
