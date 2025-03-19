// ✅ tests/customers.test.js - כולל DEBUG
const request = require('supertest');
const app = require('../src/app');

let sessionCookie = '';

describe('Customers API', () => {
  test('POST /customers/register - success', async () => {
    const res = await request(app).post('/customers/register').send({
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
    const res = await request(app).post('/customers/login').send({
      phone: '0500000000',
      license_plate: '12-345-67'
    });
    console.log('LOGIN RESPONSE:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');

    sessionCookie = res.headers['set-cookie'];
    console.log('SESSION COOKIE:', sessionCookie);
  });

  test('GET /customers/dashboard - success', async () => {
    const res = await request(app)
      .get('/customers/dashboard')
      .set('Cookie', sessionCookie);
    console.log('DASHBOARD RESPONSE:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('customer');
  });

  test('POST /customers/add-vehicle - success', async () => {
    const res = await request(app).post('/customers/add-vehicle').send({
      customer_id: 1,
      model: 'Toyota Corolla',
      license_plate: '34-567-89'
    });
    console.log('ADD VEHICLE RESPONSE:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
