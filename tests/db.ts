import pg from 'pg';

export class Database {
    // this data must match
    private config = {
        username: process.env.DATABASE_USERNAME,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: Number(process.env.DATABASE_PORT),
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