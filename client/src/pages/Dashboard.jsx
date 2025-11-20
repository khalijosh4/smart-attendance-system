import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaUserCheck, FaUserClock, FaBuilding } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    todayStats: { present: 0, late: 0, absent: 0 },
    departmentData: [],
    trendData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  const COLORS = ['#4F46E5', '#EF4444', '#F59E0B', '#10B981'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Employees" 
          value={stats.totalEmployees} 
          icon={<FaUsers />} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Present Today" 
          value={stats.todayStats.present} 
          icon={<FaUserCheck />} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Late Arrivals" 
          value={stats.todayStats.late} 
          icon={<FaUserClock />} 
          color="bg-yellow-500" 
        />
        <StatCard 
          title="Departments" 
          value={stats.totalDepartments} 
          icon={<FaBuilding />} 
          color="bg-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attendance Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Attendance Trends (Last 7 Days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.trendData}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6b7280', fontSize: 12}} 
                  dy={10}
                  tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {weekday: 'short'})}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6b7280', fontSize: 12}} 
                />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#4F46E5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAttendance)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Department Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.departmentData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  width={100}
                  tick={{fill: '#4b5563', fontSize: 12, fontWeight: 500}} 
                />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px'}} />
                <Bar dataKey="present" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} background={{ fill: '#f3f4f6', radius: [0, 4, 4, 0] }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
             <p className="text-xs text-gray-400">Showing present employees vs total per department</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colorMap = {
    'bg-blue-500': { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100' },
    'bg-green-500': { bg: 'bg-green-50', text: 'text-green-600', iconBg: 'bg-green-100' },
    'bg-yellow-500': { bg: 'bg-yellow-50', text: 'text-yellow-600', iconBg: 'bg-yellow-100' },
    'bg-purple-500': { bg: 'bg-purple-50', text: 'text-purple-600', iconBg: 'bg-purple-100' },
  };

  const theme = colorMap[color] || { bg: 'bg-gray-50', text: 'text-gray-600', iconBg: 'bg-gray-100' };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center transition-all hover:shadow-md hover:border-indigo-100 group">
      <div className={`p-4 rounded-xl ${theme.iconBg} ${theme.text} mr-4 group-hover:scale-110 transition-transform`}>
        <div className="text-2xl">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;
