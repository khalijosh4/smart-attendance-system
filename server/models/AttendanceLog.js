import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Attendance from './Attendance.js';

const AttendanceLog = sequelize.define('AttendanceLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('CHECK_IN', 'CHECK_OUT', 'BREAK_START', 'BREAK_END'),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

export default AttendanceLog;
