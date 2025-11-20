import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Employee from './Employee.js';
import AttendanceLog from './AttendanceLog.js';

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('Present', 'Absent', 'Late', 'Leave'),
    defaultValue: 'Absent',
  },
  // We keep these for quick summary, but logs are the source of truth
  checkInTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  checkOutTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Associations
Employee.hasMany(Attendance, { foreignKey: 'employeeId' });
Attendance.belongsTo(Employee, { foreignKey: 'employeeId' });

Attendance.hasMany(AttendanceLog, { foreignKey: 'attendanceId' });
AttendanceLog.belongsTo(Attendance, { foreignKey: 'attendanceId' });

export default Attendance;
