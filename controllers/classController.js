const db = require('../config/db');

exports.getClasses = async (req, res) => {
    try {
        const teacher_id = req.query.teacher_id;
        let query = "SELECT c.*, u.name as teacher_name FROM classes c LEFT JOIN users u ON c.class_teacher_id = u.id";
        let params = [];

        if (teacher_id) {
            query += " WHERE c.class_teacher_id = ?";
            params.push(teacher_id);
        }

        query += " ORDER BY c.grade_level ASC, c.name ASC";

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
