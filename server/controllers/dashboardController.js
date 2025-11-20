import { Op, Sequelize } from 'sequelize';
import Employee from '../models/Employee.js';
import Department from '../models/Department.js';
import Attendance from '../models/Attendance.js';

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10);

    // 1. Basic Counts
    const totalEmployees = await Employee.count();
    const totalDepartments = await Department.count();

    // 2. Today's Attendance Stats
    const todayAttendance = await Attendance.findAll({
      where: { date: today }
    });

    const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
    const lateCount = todayAttendance.filter(a => a.status === 'Late').length;
    const absentCount = totalEmployees - (presentCount + lateCount); // Rough estimate, or query explicit absents if generated

    // 3. Department-wise Attendance (Today)
    // We want: Department Name -> Present Count
    const departmentStats = await Department.findAll({
      include: [{
        model: Employee,
        include: [{
          model: Attendance,
          required: false,
          where: { date: today, status: { [Op.in]: ['Present', 'Late'] } }
        }]
      }]
    });

    const departmentData = departmentStats.map(dept => ({
      name: dept.name,
      present: dept.Employees.reduce((acc, emp) => acc + (emp.Attendances.length > 0 ? 1 : 0), 0),
      total: dept.Employees.length
    }));

    // 4. Attendance Trend (Last 7 Days)
    const trendDataRaw = await Attendance.findAll({
      attributes: [
        'date',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      where: {
        date: {
          [Op.gte]: sevenDaysAgoStr,
          [Op.lte]: today
        },
        status: { [Op.in]: ['Present', 'Late'] }
      },
      group: ['date'],
      order: [['date', 'ASC']]
    });

    // Fill in missing dates with 0
    const trendData = [];
    for (let d = new Date(sevenDaysAgo); d <= new Date(today); d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().slice(0, 10);
      const found = trendDataRaw.find(item => item.get('date') === dateStr);
      trendData.push({
        date: dateStr,
        attendance: found ? parseInt(found.get('count')) : 0
      });
    }

    res.json({
      totalEmployees,
      totalDepartments,
      todayStats: {
        present: presentCount,
        late: lateCount,
        absent: absentCount
      },
      departmentData,
      trendData
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
