import { Logger } from '$lib/services/logger';
import pg from 'pg';

export class Database {
    private config = {
        connectionString: process.env.DATABASE_URL,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    };

    public async executeQuery(query: string) {
        const client = new pg.Client(this.config);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: pg.QueryResult<any>;

        try {
            await client.connect();
            result = await client.query(query);
        }
        catch (err) {
            Logger.error("Error in connection/executing query:");
            Logger.info('QUERY: ', query);
            Logger.error('ERROR: ', err);
        }
        finally {
            await client.end()
                .catch((error) => {
                    Logger.error("Error ending db client connection:", error);
                });
        }

        return result! ? result.rows : [];
    }
}