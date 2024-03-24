import { SetupFixture } from "./fixtures/setup";
import { Database } from './db';

async function globalSetup() {
    const database = new Database();
    await SetupFixture.setFeatureFlags(database);
}

export default globalSetup;