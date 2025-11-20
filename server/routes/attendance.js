import express from 'express';
import * as attendanceController from '../controllers/attendanceController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', attendanceController.getAllAttendance);
router.post('/', attendanceController.markAttendance);
router.get('/employee/:employeeId', attendanceController.getAttendanceByEmployee);

export default router;
