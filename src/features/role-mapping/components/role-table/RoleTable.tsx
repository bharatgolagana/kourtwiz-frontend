import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Box,
  Paper,
} from "@mui/material";
import { Role, Task, Permission } from "../../RoleTypes";
import { getModules } from "../../api/RoleMappingAPI";
import "./RoleTable.css";
interface Module {
  _id: string;
  name: string;
}
interface RoleTableProps {
  roles: Role[];
  tasks: Task[];
  permissions: Permission[];
  handleCheckBox: (roleId: string, taskId: string) => void;
}
const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  tasks,
  permissions,
  handleCheckBox,
}) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [localPermissions, setLocalPermissions] = useState<
    Map<string, boolean>
  >(new Map());
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await getModules();
        setModules(response.data);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };
    fetchModules();
  }, []);
  useEffect(() => {
    const permissionMap = new Map<string, boolean>();
    permissions.forEach((perm) => {
      permissionMap.set(`${perm.roleId}_${perm.taskId}`, perm.enable);
    });
    setLocalPermissions(permissionMap);
  }, [permissions]);
  const getModuleName = (moduleId: string) => {
    const module = modules.find((mod) => mod._id === moduleId);
    return module ? module.name : null;
  };
  const handleLocalCheckBox = (roleId: string, taskId: string) => {
    const key = `${roleId}_${taskId}`;
    const currentStatus = localPermissions.get(key) || false;
    const updatedStatus = !currentStatus;
    setLocalPermissions(new Map(localPermissions.set(key, updatedStatus)));
    handleCheckBox(roleId, taskId);
  };
  // Filter tasks to only include those with known module IDs
  const tasksByModule =
    tasks?.length > 1 &&
    tasks?.reduce((acc, task) => {
      if (modules.some((mod) => mod._id === task.moduleId)) {
        if (!acc[task.moduleId]) {
          acc[task.moduleId] = [];
        }
        acc[task.moduleId].push(task);
      }
      return acc;
    }, {} as { [key: string]: Task[] });
  return (
    <Box className="role-table-container">
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                className="header-module"
                style={{ color: "var(--primary-color)" }}
              >
                Module / Capability
              </TableCell>
              <TableCell
                className="header-task"
                style={{ color: "var(--primary-color)" }}
              >
                Tasks
              </TableCell>
              {roles.map((role) => (
                <TableCell
                  key={role._id}
                  align="center"
                  style={{ color: "var(--primary-color)" }}
                >
                  {role.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(tasksByModule).map((moduleId) => {
              const moduleTasks = tasksByModule[moduleId];
              const moduleName = getModuleName(moduleId);
              // Skip rendering if module name is not found
              if (!moduleName) return null;
              return moduleTasks.map((task, index) => (
                <TableRow key={task._id} className="table-row">
                  {index === 0 && (
                    <TableCell
                      className="module-cell"
                      rowSpan={moduleTasks.length}
                    >
                      {moduleName}
                    </TableCell>
                  )}
                  <TableCell className="task-cell">{task.name}</TableCell>
                  {roles.map((role) => {
                    const key = `${role._id}_${task._id}`;
                    const isChecked = localPermissions.get(key) || false;
                    return (
                      <TableCell key={role._id} align="center">
                        <Checkbox
                          checked={isChecked}
                          onChange={() =>
                            handleLocalCheckBox(role._id, task._id)
                          }
                          color="primary"
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ));
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default RoleTable;
