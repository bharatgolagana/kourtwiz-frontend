import axios from "axios";

// const baseURL = import.meta.env.VITE_API_BASE_URL;
const baseURL = "http://localhost:5001";
const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getModules = async () => apiClient.get("/modules");
export const getModuleById = async (id: string) =>
  apiClient.get(`/modules/${id}`);
export const createModule = async (data: any) =>
  apiClient.post("/modules", data);

export const getTasks = async () => apiClient.get("/tasks");
export const getTasksByModuleId = async (moduleId: string) =>
  apiClient.get(`/tasks/module/${moduleId}`);
export const createTask = async (data: any) => apiClient.post("/tasks", data);

export const getRoles = async () => apiClient.get("/roles");
export const getRoleById = async (id: string) => apiClient.get(`/roles/${id}`);
export const createRole = async (data: any) => apiClient.post("/roles", data);

export const getAllPermissions = async () => apiClient.get("/permissions");
export const getPermissionsByRole = async (roleId: string) =>
  apiClient.get(`/permissions/role/${roleId}`);
export const updatePermissions = async (data: any) =>
  axios.put(`${baseURL}/permissions`, data);
