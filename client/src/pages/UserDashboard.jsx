import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserDashboard = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [empRes, attRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/employees/${id}`, {
             headers: { Authorization: `Bearer ${token}` } 
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/attendance/employee/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        
        setEmployee(empRes.data);
        setAttendance(attRes.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!employee) return <div>Employee not found</div>;

  // Prepare chart data
  const chartData = attendance.slice(0, 7).map(att => ({
    date: att.date,
    hours: att.checkOutTime && att.checkInTime ? 
      (new Date(`1970-01-01T${att.checkOutTime}Z`) - new Date(`1970-01-01T${att.checkInTime}Z`)) / 3600000 : 0
  })).reverse();

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold">
              {employee.firstName[0]}{employee.lastName[0]}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{employee.firstName} {employee.lastName}</h2>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <span className="font-medium text-gray-700">{employee.position}</span>
                <span>•</span>
                <span>{employee.Department?.name || 'No Dept'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full text-sm font-semibold">
              Active Employee
            </span>
            <span className="text-gray-400 text-sm font-mono bg-gray-50 px-2 py-1 rounded border border-gray-100">
              #{employee.employeeCode}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-100">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <span className="block text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Contact Email</span>
            <span className="font-medium text-gray-900">{employee.email}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <span className="block text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Date Hired</span>
            <span className="font-medium text-gray-900">{employee.hireDate}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <span className="block text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Attendance</span>
            <span className="font-medium text-gray-900">{attendance.length} Days Recorded</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Weekly Hours</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6b7280', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6b7280', fontSize: 12}} 
                />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                />
                <Bar dataKey="hours" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {attendance.slice(0, 5).map(att => (
              <div key={att.id} className="flex flex-col p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-indigo-100 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">{att.date}</span>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${
                      att.status === 'Late' ? 'bg-red-50 text-red-700 border-red-100' : 
                      att.status === 'Present' ? 'bg-green-50 text-green-700 border-green-100' : 
                      'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      {att.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                    {att.checkInTime || '--:--'} - {att.checkOutTime || '--:--'}
                  </div>
                </div>
                {att.remarks && (
                  <div className="text-sm text-gray-600 bg-white/50 p-2 rounded border border-gray-100/50 italic">
                    "{att.remarks}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
