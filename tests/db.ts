import pg from 'pg';

export class Database {
    private config = {
        connectionString: process.env.DATABASE_URL,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    };

    public async executeQuery(query: string) {
        const client = new pg.Client(this.config);

        try {
            await client.connect();
            await client.query(query);
        }
        catch (err) {
            console.error("Error in connection/executing query:");
            console.log('QUERY: ', query);
            console.error('ERROR: ', err);
        }
        finally {
            await client.end()
                .catch((error) => {
                    console.error("Error ending db client connection:", error);
                });
        }
    }
}