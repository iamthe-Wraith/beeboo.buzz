import type { Database } from "../db";

interface IFeatureFlagsConfig {
    signupEnabled: boolean;
}

const defaultFeatureFlagsConfig: IFeatureFlagsConfig = {
    signupEnabled: true,
};

export class SetupFixture {
    public static cleanup = async (database: Database) => {
        await database.executeQuery(`DELETE FROM "FeatureFlag"`);
    }

    public static setFeatureFlags = async (database: Database, config: Partial<IFeatureFlagsConfig> = {}) => {
        await SetupFixture.cleanup(database);

        const _config = { ...defaultFeatureFlagsConfig, ...config };

        // await database.executeQuery(`DELETE FROM "Task" WHERE "owner_id" = '${result[0].id}'`);
        
        // create a new feature flag record in the database
        await database.executeQuery(`
            INSERT INTO "FeatureFlag" (id, name, slug, description, is_enabled, created_at, updated_at, updated_by)
            VALUES (1, 'Allow New Users', 'allow-new-users', 'allows new users to sign up.', ${_config.signupEnabled}, NOW(), NOW(), 1234567890);
        `); 
    }
}