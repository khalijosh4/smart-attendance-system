import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConfirmationModal from '../components/ConfirmationModal';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);

  const token = localStorage.getItem('token');

  const fetchDepartments = React.useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to fetch departments');
    }
  }, [token]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/departments`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      fetchDepartments();
      setFormData({ name: '', description: '' });
      toast.success('Department created successfully!');
    } catch (error) {
      console.error('Error creating department:', error);
      toast.error('Failed to create department');
    }
  };

  const confirmDelete = (id) => {
    setDeptToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (deptToDelete) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/departments/${deptToDelete}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchDepartments();
        toast.success('Department deleted successfully');
      } catch (error) {
        console.error('Error deleting department:', error);
        toast.error('Failed to delete department');
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Departments</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center justify-center w-full md:w-auto"
        >
          <FaPlus className="mr-2" /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{dept.name}</h3>
              <button onClick={() => confirmDelete(dept.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                <FaTrash />
              </button>
            </div>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">{dept.description || 'No description provided.'}</p>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200/60">
              <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                {dept.employeeCount} Members
              </span>
              <Link to={`/departments/${dept.id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View Details <span className="text-xs">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Department"
        message="Are you sure you want to delete this department? This will also affect employees in this department."
      />

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Department</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Department Name</label>
                <input 
                  name="name" 
                  placeholder="Engineering" 
                  onChange={handleChange} 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea 
                  name="description" 
                  placeholder="Brief description of the department..." 
                  onChange={handleChange} 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none" 
                  rows="4"
                ></textarea>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-semibold shadow-sm hover:shadow-md"
                >
                  Add Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
