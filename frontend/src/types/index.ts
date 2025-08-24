export interface User {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "User";
  token: string;
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  role: "Manager" | "User";
}

export interface Todo {
  _id: string;
  task: string;
  status: "Pending" | "Completed";
  dueDate?: string;
}
