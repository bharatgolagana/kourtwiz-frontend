import React, { useEffect } from "react";
import { UseUserPermissions } from "./UseUserPermissions";
import { useNavigate } from "react-router-dom";

const HasAccess = ({
  requiredPermission,
  children,
}: {
  requiredPermission: string;
  children: React.ReactNode;
}): JSX.Element => {
  const navigate = useNavigate();
  const { userPermissions, loading, isWelcome } = UseUserPermissions();

  useEffect(() => {
    if (!loading && isWelcome) {
      navigate("/welcome-page");
    }
  }, [loading, isWelcome, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const hasPermission = userPermissions.some(
    (permission: { taskValue: string; enable: boolean }) =>
      permission.taskValue === requiredPermission && permission.enable
  );

  if (!hasPermission) {
    return (
      <div style={{ marginLeft: "1rem" }}>
        Access Denied please contact admin
      </div>
    );
  }

  return <>{children}</>;
};

export default HasAccess;
