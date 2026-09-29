const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    getTotalStudents,
    getStudentsByCourse,
    getAverageAgeByCourse
} = require("../controllers/studentController");

router.get("/aggregate/total", authMiddleware, getTotalStudents);
router.get("/aggregate/course", authMiddleware, getStudentsByCourse);
router.get("/aggregate/average-age", authMiddleware, getAverageAgeByCourse);
router.get("/", authMiddleware, getStudents);
router.get("/:id", authMiddleware, getStudentById);
router.post("/", authMiddleware, roleMiddleware("admin"), createStudent);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateStudent);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteStudent);

module.exports = router;