import { test, expect } from './custom-test';

test('status route returns 200', async ({ request }) => {
    const res = await request.get('/status');
    const data = await res.json();

    expect(res.status()).toEqual(200);
    expect(data.status).toEqual('ok');
});