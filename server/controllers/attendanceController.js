import Attendance from '../models/Attendance.js';
import AttendanceLog from '../models/AttendanceLog.js';
import Employee from '../models/Employee.js';

export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findAll({
      include: [
        { model: Employee },
        { model: AttendanceLog },
      ],
      order: [['date', 'DESC']],
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { employeeId, type, timestamp } = req.body; // type: CHECK_IN, CHECK_OUT, BREAK_START, BREAK_END
    const date = new Date(timestamp).toISOString().split('T')[0];
    const time = new Date(timestamp).toTimeString().split(' ')[0];

    // Fetch Settings
    const settingsList = await import('../models/Setting.js').then(m => m.default.findAll());
    const settings = {};
    settingsList.forEach(s => settings[s.key] = s.value);

    const officialCheckIn = settings['officialCheckIn'] || '09:00:00';
    const officialCheckOut = settings['officialCheckOut'] || '17:00:00';

    let attendance = await Attendance.findOne({ where: { employeeId, date } });
    let remarks = attendance ? attendance.remarks : null;
    let status = attendance ? attendance.status : 'Absent';

    if (!attendance) {
      if (type !== 'CHECK_IN') {
        return res.status(400).json({ error: 'Must check in first' });
      }
      
      // Check In Logic
      status = 'Present';
      if (time > officialCheckIn) {
        status = 'Late';
        remarks = `Late (Checked in at ${time})`;
      } else {
        remarks = `Early (Checked in at ${time})`;
      }

      attendance = await Attendance.create({
        employeeId,
        date,
        status,
        checkInTime: time,
        remarks,
      });
    }

    // Create Log
    await AttendanceLog.create({
      attendanceId: attendance.id,
      type,
      timestamp,
    });

    // Update main record summary if needed
    if (type === 'CHECK_OUT') {
      // Check Out Logic
      let newRemarks = remarks ? remarks + '; ' : '';
      if (time < officialCheckOut) {
        newRemarks += `Left Early (Checked out at ${time})`;
      } else {
        newRemarks += `Overtime (Checked out at ${time})`;
      }
      
      await attendance.update({ checkOutTime: time, remarks: newRemarks });
    }

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAttendanceByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const attendance = await Attendance.findAll({
      where: { employeeId },
      include: [AttendanceLog],
      order: [['date', 'DESC']],
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
