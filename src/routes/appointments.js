const express = require('express');
const router = express.Router();
const db = require('../db');

const treatmentDurations = {
    "טיפול גדול": 120, // 2 שעות
    "טיפול קטן": 60, // 1 שעה
    "בדיקה ראשונית": 180, // 3 שעות
    "תקלה במערכת גז": 180 // 3 שעות
};

// ✅ הצגת טופס התיאום + רשימת תורים
router.get('/', (req, res) => {
    if (!req.session.customerId) {
        return res.redirect('/customers/login'); // אם אין סשן, להפנות להתחברות
    }

    const customerId = req.session.customerId;

    db.all(`SELECT * FROM vehicles WHERE customer_id = ?`, [customerId], (err, vehicles) => {
        if (err) {
            return res.status(500).send('❌ שגיאה בשליפת רכבים.');
        }

        db.all(`SELECT * FROM appointments WHERE vehicle_id IN (SELECT id FROM vehicles WHERE customer_id = ?)`, 
            [customerId], (err, appointments) => {
            if (err) {
                return res.status(500).send('❌ שגיאה בשליפת תורים.');
            }

            res.render('appointments', { title: 'תיאום תור', vehicles, appointments });
        });
    });
});

// ✅ הוספת תור
router.post('/add', (req, res) => {
    const { vehicle_id, service, date, time } = req.body; // ייקבל נתונים בפורמט JSON

    console.log("📩 קיבלנו נתונים מהטופס:");
    console.log("🚗 vehicle_id:", vehicle_id);
    console.log("🛠️ service:", service);
    console.log("📅 date:", date);
    console.log("⏰ time:", time);

    if (!vehicle_id || !service || !date || !time) {
        console.error("❌ נתונים חסרים! הבקשה נדחתה.");
        return res.status(400).json({ success: false, message: "נתונים חסרים. אנא מלא את כל השדות." });
    }

    const appointmentDateTime = `${date} ${time}`;

    // בדיקת תאריך חסום
db.get(`SELECT * FROM blocked_days WHERE date = ?`, [dateOnly], (err, row) => {
    if (row && !req.session.isAdmin) {
      return res.status(400).json({ error: "התאריך חסום לתיאום תורים" });
    }
    // המשך הוספת התור למסד...
  });
  

    db.run(`INSERT INTO appointments (vehicle_id, service, date) VALUES (?, ?, ?)`,
        [vehicle_id, service, appointmentDateTime],
        function (err) {
            if (err) {
                console.error("❌ שגיאה בהוספת תור:", err.message);
                return res.status(500).json({ success: false, message: "שגיאה בתיאום תור" });
            }
            console.log("✅ התור נשמר בהצלחה!");
            res.json({ success: true, message: "התור נקבע בהצלחה!", appointment: { vehicle_id, service, date: appointmentDateTime } });
        });
});


// ✅ קבלת שעות פנויות בהתאם לשירות ולתאריך
router.get('/available-slots', (req, res) => {
    const { service, date } = req.query;

    if (!service || !date || !treatmentDurations[service]) {
        return res.status(400).json({ success: false, message: "❌ סוג טיפול לא חוקי או תאריך חסר." });
    }

    const duration = treatmentDurations[service];
    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.getDay(); // 0 - שבת, 5 - שישי

    // ✅ סגירה בשבת לחלוטין
    if (dayOfWeek === 6) {
        return res.json([]);
    }

    // ✅ שעות עבודה סטנדרטיות
    let startHour = 7 * 60 + 30; // 07:30
    let endHour = 14 * 60; // 14:00

    // ✅ ביום שישי התור האחרון עד 11:00, ורק לטיפולים מסוימים
    if (dayOfWeek === 5) {
        endHour = 11 * 60; // 11:00
        if (service !== "טיפול גדול" && service !== "טיפול קטן") {
            return res.json([]);
        }
    }

    db.all(`SELECT date FROM appointments WHERE date LIKE ? ORDER BY date`, [`${date}%`], (err, appointments) => {
        if (err) {
            return res.status(500).send("❌ שגיאה בשליפת תורים");
        }

        let availableSlots = [];
        let currentTime = startHour;

        while (currentTime + duration <= endHour) {
            const slotStart = `${String(Math.floor(currentTime / 60)).padStart(2, '0')}:${String(currentTime % 60).padStart(2, '0')}`;
            const slotEnd = `${String(Math.floor((currentTime + duration) / 60)).padStart(2, '0')}:${String((currentTime + duration) % 60).padStart(2, '0')}`;

            let isAvailable = true;
            appointments.forEach(appointment => {
                const appointmentTime = parseInt(appointment.date.split(":")[0]) * 60 + parseInt(appointment.date.split(":")[1]);
                if (appointmentTime >= currentTime && appointmentTime < currentTime + duration) {
                    isAvailable = false;
                }
            });

            if (isAvailable) {
                availableSlots.push({ start: slotStart, end: slotEnd });
            }

            currentTime += 30;
        }

        res.json(availableSlots);
    });
});

module.exports = router;
