import { useEffect, useState } from "react";
import { useUserInfo } from "./UserInfoContext";

export type UserPermissions = {
  roleId: string;
  taskId: string;
  taskName: string;
  taskValue: string;
  enable: boolean;
};

export const useHasPermission = (
  _role: string
): ((permissionName: string) => boolean) => {
  const { userInfo } = useUserInfo();
  const [userPermissions, setUserPermissions] = useState<UserPermissions[]>([]);

  useEffect(() => {
    if (userInfo?.authorities) {
      setUserPermissions(userInfo.authorities || []);
    }
  }, [userInfo]);

  const hasPermission = (permissionName: string): boolean => {
    return userPermissions.some(
      (permission) =>
        permission.taskValue === permissionName && permission.enable === true
    );
  };

  return hasPermission;
};
