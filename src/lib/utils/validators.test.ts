import { describe, test, expect } from 'vitest';
import { validateEmail, validatePassword, validateUsername } from './validators';

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

    describe('validatePassword', () => {
        test('returns no error if is valid password', async () => {
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
                const validated = validatePassword(password);

                await expect(validated.error).toEqual('');
                await expect(validated.value).toEqual(password);
            })
        });

        test('returns error if no password is provided', async () => {
            const validated = validatePassword('');

            await expect(validated.error).toEqual('Password is required');
            await expect(validated.value).toEqual('');
        });

        test('returns error if invalid password - too short', async () => {
            const password = 'nW12!';

            const validated = validatePassword(password);

            await expect(validated.error).toEqual('Password must be at least 8 characters');
            await expect(validated.value).toEqual(password);
        });

        test('returns error if invalid password - too long', async () => {
            const password = '1Nv@lid-ljhabdvouyqwbrvlbqelihslkdmngmerbgljerugtluqjehb&^%janbfnbasdbluyfgabdljhfbjanevlahjebvualydhvblajhsdvKJGFUHJVkhgvfjhgfj';

            const validated = validatePassword(password);

            await expect(validated.error).toEqual('Password must be less than 100 characters');
            await expect(validated.value).toEqual(password);
        });

        test('returns error if invalid password - no lowercase', async () => {
            const password = 'N1V@LIU2';

            const validated = validatePassword(password);

            await expect(validated.error).toEqual('Password must contain at least one lowercase letter');
            await expect(validated.value).toEqual(password);
        });

        test('returns error if invalid password - no uppercase', async () => {
            const password = 'n1v@liu2';

            const validated = validatePassword(password);

            await expect(validated.error).toEqual('Password must contain at least one uppercase letter');
            await expect(validated.value).toEqual(password);
        });

        test('returns error if invalid password - no number', async () => {
            const password = 'Niv@liuHt';

            const validated = validatePassword(password);

            await expect(validated.error).toEqual('Password must contain at least one number');
            await expect(validated.value).toEqual(password);
        });

        test('returns error if invalid password - no special character', async () => {
            const password = 'Nv1lid123boP';

            const validated = validatePassword(password);

            await expect(validated.error).toEqual('Password must contain at least one special character: !@#$%^&*()_-+={[}]|:;"\'<,>.');
            await expect(validated.value).toEqual(password);
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