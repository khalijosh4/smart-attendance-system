import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DepartmentDetails = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/departments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartment(response.data);
      } catch (error) {
        console.error('Error fetching department:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartment();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!department) return <div>Department not found</div>;

  // Mock data for charts (replace with real analytics if available)
  const performanceData = [
    { name: 'High Performers', value: 4, color: '#10B981' },
    { name: 'Average', value: 8, color: '#3B82F6' },
    { name: 'Needs Improvement', value: 2, color: '#EF4444' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{department.name} Dashboard</h2>
      <p className="text-gray-600 mb-8">{department.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Employee Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Department Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Total Employees</span>
              <span className="font-bold text-xl">{department.Employees.length}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Manager</span>
              <span className="font-bold">TBD</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Budget Utilization</span>
              <span className="font-bold text-green-600">85%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Employees in {department.name}</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {department.Employees.map((emp) => (
              <tr key={emp.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{emp.firstName} {emp.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{emp.position}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{emp.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentDetails;
