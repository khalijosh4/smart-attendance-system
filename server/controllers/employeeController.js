import Employee from '../models/Employee.js';
import Department from '../models/Department.js';
import { Op } from 'sequelize';

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id, {
      include: [Department]
    });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const { search } = req.query;
    let where = {};
    if (search) {
      where = {
        [Op.or]: [
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } },
          { employeeCode: { [Op.like]: `%${search}%` } },
        ],
      };
    }
    const employees = await Employee.findAll({
      where,
      include: [Department]
    });
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { departmentId, hireDate } = req.body;

    // Fetch Department for code generation
    const department = await Department.findByPk(departmentId);
    if (!department) return res.status(404).json({ error: 'Department not found' });

    // Generate Employee Code: DEP-YYYY-XXXX
    const deptPrefix = department.name.substring(0, 3).toUpperCase();
    const year = new Date(hireDate || new Date()).getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 digit random number
    const employeeCode = `${deptPrefix}-${year}-${randomSuffix}`;

    const employee = await Employee.create({ ...req.body, employeeCode });
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Employee.update(req.body, { where: { id } });
    if (updated) {
      const updatedEmployee = await Employee.findByPk(id);
      res.json(updatedEmployee);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Employee.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
