import { test as base } from '@playwright/test';
import { Database } from './db';

type IFixtures = {
  database: Database;
};

export const test = base.extend<IFixtures>({
  // eslint-disable-next-line no-empty-pattern
  database: async ({}, use) => {
    const db = new Database();
    await use(db);
  },
});

export { expect } from '@playwright/test';