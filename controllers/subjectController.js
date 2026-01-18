const db = require('../config/db');

exports.getSubjects = async (req, res) => {
    try {
        const grade_level = req.query.grade_level;
        let query = "SELECT * FROM subjects";
        let params = [];

        if (grade_level) {
            query += " WHERE grade_level = ?";
            params.push(grade_level);
        }

        query += " ORDER BY title ASC";

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
