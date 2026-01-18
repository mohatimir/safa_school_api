const db = require('../config/db');

exports.takeAttendance = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { class_id, date, attendance, recorded_by } = req.body;

        if (!class_id || !date || !attendance) {
            return res.status(400).json({ status: "error", message: "Missing required fields" });
        }

        // Delete existing
        await connection.execute("DELETE FROM attendance WHERE class_id = ? AND date = ?", [class_id, date]);

        // Insert new
        const userId = recorded_by || 1;

        // attendance is Map<student_id, status> but coming as object from JSON
        const queries = [];
        for (const [student_id, status] of Object.entries(attendance)) {
            let dbStatus = 'Present';
            let isPresent = 1;
            if (status === 'A') {
                dbStatus = 'Absent';
                isPresent = 0;
            } else if (status === 'L') {
                dbStatus = 'Late';
                isPresent = 1;
            }
            // Check if 'status' column exists in your schema? The PHP code implies it does or tries to use it.
            // But looking at schema earlier, it had 'present' (tinyint). 
            // The PHP code does INSERT ... (..., present, status, ...)
            // Let's assume schema has both or at least 'present'. 
            // If 'status' column is missing in DB, this might fail unless updated.
            // I'll stick to 'present' which is standard in your schema shown earlier.
            // Wait, previous PHP code showed: INSERT INTO attendance (..., present, status, ...)
            // So status column must exist.

            queries.push(connection.execute(
                "INSERT INTO attendance (student_id, class_id, date, present, status, recorded_by) VALUES (?, ?, ?, ?, ?, ?)",
                [student_id, class_id, date, isPresent, dbStatus, userId]
            ));
        }

        await Promise.all(queries);

        await connection.commit();
        res.json({ status: "success", message: "Attendance recorded" });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ status: "error", message: error.message });
    } finally {
        connection.release();
    }
};

exports.getAttendance = async (req, res) => {
    try {
        const { student_id, date, class_id } = req.query;

        let query = `SELECT a.*, s.first_name, s.last_name, c.name as class_name 
                     FROM attendance a 
                     JOIN students s ON a.student_id = s.id 
                     JOIN classes c ON a.class_id = c.id`;
        let params = [];
        let where = [];

        if (student_id) { where.push("a.student_id = ?"); params.push(student_id); }
        if (date) { where.push("a.date = ?"); params.push(date); }
        if (class_id) { where.push("a.class_id = ?"); params.push(class_id); }

        if (where.length > 0) {
            query += " WHERE " + where.join(" AND ");
        }

        query += " ORDER BY a.date DESC";

        const [rows] = await db.execute(query, params);

        res.json({
            status: "success",
            count: rows.length,
            data: rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: error.message });
    }
};
