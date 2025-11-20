import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [type, setType] = useState('CHECK_IN');
  const [timestamp, setTimestamp] = useState('');

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [attRes, empRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/attendance`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setAttendance(attRes.data);
      setEmployees(empRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    // Set default timestamp to current local time in format YYYY-MM-DDTHH:mm
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setTimestamp(now.toISOString().slice(0, 16));
  }, []);

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/attendance`, {
        employeeId: selectedEmployee,
        type,
        timestamp: new Date(timestamp).toISOString(),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
      alert('Attendance marked successfully');
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert(error.response?.data?.error || 'Error marking attendance');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Attendance Tracking</h2>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 mb-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Log Activity</h3>
        <form onSubmit={handleMarkAttendance} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.employeeCode})</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              required
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            >
              <option value="CHECK_IN">Check In</option>
              <option value="BREAK_START">Start Break</option>
              <option value="BREAK_END">End Break</option>
              <option value="CHECK_OUT">Check Out</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
          >
            Log Activity
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">First Check-In</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Check-Out</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {attendance.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {record.Employee ? `${record.Employee.firstName} ${record.Employee.lastName}` : 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full border 
                    ${record.status === 'Present' ? 'bg-green-50 text-green-700 border-green-100' : 
                      record.status === 'Absent' ? 'bg-red-50 text-red-700 border-red-100' : 
                      record.status === 'Late' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{record.checkInTime || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{record.checkOutTime || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="max-w-xs overflow-x-auto flex gap-2">
                    {record.AttendanceLogs && record.AttendanceLogs.map((log, idx) => (
                      <div key={idx} className="text-xs bg-gray-50 px-2 py-1 rounded border border-gray-100 whitespace-nowrap">
                        <span className="font-semibold text-gray-700">{log.type.replace('_', ' ')}:</span> {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
