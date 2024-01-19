import { describe, expect, test } from "vitest";
import { sleep } from "./gen";

describe("utils - gen", () => {
    describe('sleep', () => {
        test('should force execution to sleep for N milliseconds', async () => {
            const start = Date.now();

            await sleep(1000);

            const end = Date.now();

            expect(end - start).toBeGreaterThanOrEqual(1000);
        });
    });
});