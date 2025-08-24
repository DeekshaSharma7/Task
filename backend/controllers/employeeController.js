import Employee from "../models/Employee.js";

export const getEmployees = async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
};

export const addEmployee = async (req, res) => {
  const { name, email, role } = req.body;
  const employee = new Employee({ name, email, role });
  await employee.save();
  res.status(201).json(employee);
};

export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const employee = await Employee.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json(employee);
};

export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  await Employee.findByIdAndDelete(id);
  res.json({ message: "Employee deleted" });
};
