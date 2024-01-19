import { describe, expect, test } from "vitest";
import { JWT } from "./jwt";

describe("utils - jwt", () => {
    describe('sign', () => {
        test('should sign a payload with default options', async () => {
            const jwt = JWT.sign({ id: '123' });

            expect(jwt).toBeDefined();
            expect(jwt).toBeTypeOf('string');
            expect(jwt.length).toBeGreaterThan(0);
        });

        test('should sign a payload with custom options', async () => {
            const jwt = JWT.sign({ id: '123' }, { expiresIn: '1h' });

            expect(jwt).toBeDefined();
            expect(jwt).toBeTypeOf('string');
            expect(jwt.length).toBeGreaterThan(0);
        });
    });

    describe('read', () => {
        test('should read a valid jwt', async () => {
            const jwt = JWT.sign({ id: '123' }, { expiresIn: '2s' });
            const payload = JWT.read(jwt);

            expect(payload).toBeDefined();
            expect(payload).toBeTypeOf('object');
            expect(payload.id).toBe('123');
        });
    });
});