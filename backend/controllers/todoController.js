import ToDo from "../models/ToDo.js";

export const getTodos = async (req, res) => {
  const todos = await ToDo.find({ userId: req.user._id });
  res.json(todos);
};

export const addTodo = async (req, res) => {
  const { task, dueDate } = req.body;
  const todo = new ToDo({
    userId: req.user._id,
    task,
    dueDate: dueDate ? new Date(dueDate) : undefined,
  });
  await todo.save();
  res.status(201).json(todo);
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  if (updateData.dueDate) {
    updateData.dueDate = new Date(updateData.dueDate);
  }
  const todo = await ToDo.findByIdAndUpdate(id, updateData, { new: true });
  res.json(todo);
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  await ToDo.findByIdAndDelete(id);
  res.json({ message: "Task deleted" });
};
