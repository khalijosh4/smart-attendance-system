import Department from '../models/Department.js';
import Employee from '../models/Employee.js';

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: [{ model: Employee, attributes: ['id'] }]
    });
    // Add employee count
    const data = departments.map(dept => ({
      ...dept.toJSON(),
      employeeCount: dept.Employees.length
    }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByPk(id, {
      include: [Employee]
    });
    if (!department) return res.status(404).json({ error: 'Department not found' });
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Department.update(req.body, { where: { id } });
    if (updated) {
      const updatedDept = await Department.findByPk(id);
      res.json(updatedDept);
    } else {
      res.status(404).json({ error: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Department.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
