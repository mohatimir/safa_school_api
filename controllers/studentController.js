const db = require('../config/db');

exports.getStudents = async (req, res) => {
    try {
        const class_id = req.query.class_id;
        const search = req.query.search;

        let query = "SELECT s.*, c.name as class_name FROM students s LEFT JOIN classes c ON s.class_id = c.id WHERE s.status = 'Active'";
        let params = [];

        if (class_id) {
            query += " AND s.class_id = ?";
            params.push(class_id);
        }

        if (search) {
            const searchTerm = `%${search}%`;
            query += " AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.student_code LIKE ?)";
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += " ORDER BY s.first_name ASC";

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
