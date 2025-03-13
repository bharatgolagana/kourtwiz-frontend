import { useEffect, useState } from "react";
import { useUserInfo } from "./UserInfoContext";

export type UserPermissions = {
  roleId: string;
  taskId: string;
  taskName: string;
  taskValue: string;
  enable: boolean;
};

export const UseUserPermissions = () => {
  const { userInfo } = useUserInfo();
  const [userPermissions, setUserPermissions] = useState<UserPermissions[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (userInfo) {
      setUserPermissions(userInfo.authorities || []);
      setLoading(false);
    }
  }, [userInfo]);

  const isWelcome = userInfo?.isWelcome === true;

  return { userPermissions, loading, isWelcome };
};
