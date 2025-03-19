const request = require('supertest');
const app = require('../src/app');

describe('Blocked Days API', () => {
  let testDate = '2025-05-01';

  // ✅ בדיקה שהמערכת מחזירה 200 ושליפה תקינה
  test('GET /blockedDays - should return all blocked days', async () => {
    const res = await request(app).get('/blockedDays');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ✅ חסימת תאריך חדש
  test('POST /blockedDays/block - should block a new date', async () => {
    const res = await request(app)
      .post('/blockedDays/block')
      .send({ date: testDate });

    // במידה וההרצה מצריכה session של מנהל - תוסיף .set('Cookie', 'session=value')
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(300);
    expect(res.body).toHaveProperty('message');
  });

  // ✅ בדיקה שהתאריך באמת חסום לאחר הוספה
  test('GET /blockedDays - should include the new blocked date', async () => {
    const res = await request(app).get('/blockedDays');
    const dates = res.body.map((item) => item.date);
    expect(dates).toContain(testDate);
  });

  // ✅ ביטול חסימה של התאריך
  test('DELETE /blockedDays/unblock/:date - should unblock the date', async () => {
    const res = await request(app).delete(`/blockedDays/unblock/${testDate}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  // ✅ לוודא שהתאריך הוסר
  test('GET /blockedDays - should not contain the unblocked date', async () => {
    const res = await request(app).get('/blockedDays');
    const dates = res.body.map((item) => item.date);
    expect(dates).not.toContain(testDate);
  });
});
