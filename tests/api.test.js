const path = require('path');
const fs = require('fs');
const request = require('supertest');
const { app, db, ready } = require('../server');

const TEST_DB = path.join(__dirname, 'test.sqlite');

beforeAll(async () => {
  if (fs.existsSync(TEST_DB)) {
    fs.unlinkSync(TEST_DB);
  }
  process.env.DB_FILE = TEST_DB;
  process.env.JWT_SECRET = 'test-secret';
  process.env.DEFAULT_SEED_PASSWORD = 'password';
  await ready;
});

afterAll(done => {
  db.close(done);
});

describe('Fund transfer API', () => {
  let token;

  test('login with seeded user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'alice', password: 'password' })
      .expect(200);

    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('get profile', async () => {
    const res = await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.user.username).toBe('alice');
  });

  test('transfer funds to bob', async () => {
    const res = await request(app)
      .post('/api/transfer')
      .set('Authorization', `Bearer ${token}`)
      .send({ to_account: 'bob', amount: 100 })
      .expect(200);

    expect(res.body.ok).toBe(true);
    expect(res.body.balance).toBeDefined();
  });

  test('transactions reflect transfer', async () => {
    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body.transactions)).toBe(true);
    expect(res.body.transactions.length).toBeGreaterThan(0);
  });
});
