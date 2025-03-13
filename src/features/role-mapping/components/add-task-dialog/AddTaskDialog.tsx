import React, { useState, useRef } from 'react';
import './AddTaskDialog.css';
import { createTask } from '../../api/RoleMappingAPI';
import { Module, Role, Task, Permission } from '../../RoleTypes';
import { Button } from "@mui/material";

interface AddTaskDialogProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modules: Module[];
  roles: Role[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setPermissions: React.Dispatch<React.SetStateAction<Permission[]>>;
  onTaskCreated: () => void;
}

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({
  isModalOpen,
  setIsModalOpen,
  modules,
  roles,
  setTasks,
  setPermissions,
  onTaskCreated,
}) => {
  const [selModule, setSelModule] = useState<string>(modules[0]?._id || '');
  const [operation, setOperation] = useState<string>('create');
  const taskNameRef = useRef<HTMLInputElement>(null);
  const taskValueRef = useRef<HTMLInputElement>(null);

  const handleModuleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelModule(event.target.value);
  };

  const handleOperationChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setOperation(event.target.value);
  };

  const handleTaskSave = async (): Promise<void> => {
    if (taskNameRef.current && taskValueRef.current && selModule && operation) {
      const taskName = taskNameRef.current.value.trim();
      const taskValue = taskValueRef.current.value.trim();

      if (!taskName || !taskValue) {
        console.error('Task Name and Task Value are required.');
        return;
      }

      const newTask = {
        name: taskName,
        task_value: taskValue,
        moduleId: selModule,
        operation,
      };

      try {
        const response = await createTask(newTask);

        const createdTask: Task = {
          _id: response.data._id,
          ...newTask,
          task_value: response.data.value,
        };

        setTasks((prevTasks) => [...prevTasks, createdTask]);

        const newPermissions: Permission[] = roles.map((role) => ({
          id: `${role._id}_${createdTask._id}`,
          roleId: role._id,
          taskId: createdTask._id,
          enable: false,
        }));

        setPermissions((prevPermissions) => [
          ...prevPermissions,
          ...newPermissions,
        ]);

        console.log('Task created successfully');
        onTaskCreated();
      } catch (error) {
        console.error('Failed to create task', error);
      } finally {
        setIsModalOpen(false);
      }
    } else {
      console.error('Task Name, Task Value, Module ID, and Operation are required.');
    }
  };

  return (
    isModalOpen && (
      <div className="add-task-dialog modal open">
        <div className="modal-content">
          <h2>Add Task</h2>
          <div className="form-group">
            <label>Select Module</label>
            <select value={selModule} onChange={handleModuleChange}>
              {modules.map((module) => (
                <option key={module._id} value={module._id}>
                  {module.name}
                </option>
              ))}
            </select>
          </div>

          {selModule && (
            <>
              <div className="form-group">
                <label>Task Name</label>
                <input type="text" ref={taskNameRef} />
              </div>
              <div className="form-group">
                <label>Task Value</label>
                <input type="text" ref={taskValueRef} />
              </div>
              <div className="form-group">
                <label>Operation</label>
                <select value={operation} onChange={handleOperationChange}>
                  <option value="create">Create</option>
                  <option value="read">Read</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                </select>
              </div>
            </>
          )}
          <div className="modal-actions">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleTaskSave} disabled={!selModule}>
              Save
            </Button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddTaskDialog;
