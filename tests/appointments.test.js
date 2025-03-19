const request = require('supertest');
const app = require('../src/app');

describe('Appointments API', () => {
  // בדיקה כללית שה-GET מחזיר מערך
  test('GET /appointments - success', async () => {
    const res = await request(app).get('/appointments');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // בדיקה שהמערכת מחזירה שגיאה כאשר חסרים שדות חובה
  test('POST /appointments - missing data', async () => {
    const res = await request(app).post('/appointments').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // בדיקה מוצלחת של יצירת תור
  test('POST /appointments - valid appointment', async () => {
    const newAppointment = {
      customer_id: 1,
      vehicle_id: 1,
      service: 'טיפול קטן',
      date: '2025-04-01T09:00:00'
    };

    const res = await request(app).post('/appointments').send(newAppointment);

    // אפשר לשנות ל-201 אם בקוד שלך מחזיר 201
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(300);
    expect(res.body).toHaveProperty('message');
  });
});
