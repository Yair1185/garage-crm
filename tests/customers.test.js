// ✅ tests/customers.test.js עם supertest-session
const session = require('supertest-session');
const app = require('../src/app');

let testSession;

beforeEach(() => {
  testSession = session(app);
});

describe('Customers API', () => {
  test('POST /customers/register - success', async () => {
    const res = await testSession.post('/customers/register').send({
      name: 'Test User',
      phone: '0500000000',
      email: 'testuser@example.com',
      model: 'Mazda 3',
      license_plate: '12-345-67'
    });
    console.log('REGISTER RESPONSE:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('POST /customers/login - success', async () => {
    const res = await testSession.post('/customers/login').send({
      phone: '0500000000',
      license_plate: '12-345-67'
    });
    console.log('LOGIN RESPONSE:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('GET /customers/dashboard - success', async () => {
    await testSession.post('/customers/login').send({
      phone: '0500000000',
      license_plate: '12-345-67'
    });
    const res = await testSession.get('/customers/dashboard');
    console.log('DASHBOARD RESPONSE:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('customer');
  });

  test('POST /customers/add-vehicle - success', async () => {
    const res = await testSession.post('/customers/add-vehicle').send({
      customer_id: 1, // חשוב לוודא שה-ID קיים
      model: 'Toyota Corolla',
      license_plate: '34-567-89'
    });
    console.log('ADD VEHICLE RESPONSE:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
