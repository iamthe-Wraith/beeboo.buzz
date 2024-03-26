import { z } from "zod";

export const emailSchema = z.string({
    required_error: 'Email is required',
    invalid_type_error: "Email must be a string",
})
    .trim()
    .min(1, 'Email is required')
    .email();

export const passwordSchema = z.string({
    required_error: 'Password is required',
    invalid_type_error: "Password must be a string",
})
    .trim()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .refine(
        (value: string) => /[-._!"`'#%&,:;<>=@{}~$()*+/\\?[\]^|]+/.test(value),
        'Password must contain at least one special character: !@#$%^&*()_-+={[}]|:;"\'<,>.'
    );

export const usernameSchema = z.string({
    required_error: 'Username is required',
    invalid_type_error: "Username must be a string",
})
    .trim()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username must contain only letters, numbers, underscores and hyphens');
