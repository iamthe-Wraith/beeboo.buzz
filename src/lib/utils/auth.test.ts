import { describe, expect, test } from "vitest";
import { generatePasswordHash, isValidPassword } from "./auth";

describe("utils - auth", () => {
    describe('generatePasswordHash', () => {
        test("should generate a password hash", async () => {
            const hash = await generatePasswordHash("password");
    
            expect(hash).toBeDefined();
            expect(hash).toBeTypeOf('string');
            expect(hash.length).toBeGreaterThan(0);
        });
    
        test("should throw error if no password is received", async () => {
            await expect(generatePasswordHash("")).rejects.toThrowError('Password is required.');
        });
    })

    describe('isValidPassword', () => {
        test("should validate a password", async () => {
            const hash = await generatePasswordHash("password");
            await expect(isValidPassword("password", hash)).resolves.toBeUndefined();
        });
    
        test("should throw error if no password is received", async () => {
            await expect(isValidPassword("", "")).rejects.toThrowError('Password is required.');
        });
    
        test("should throw error if no encrypted password is received", async () => {
            await expect(isValidPassword("password", "")).rejects.toThrowError('Encrypted password is required.');
        });
    
        test("should throw error if password is invalid", async () => {
            const hash = await generatePasswordHash("password");
            await expect(isValidPassword("invalid", hash)).rejects.toThrowError('Invalid email or password.');
        });
    });
});