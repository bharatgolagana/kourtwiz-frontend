import React, { StrictMode, useEffect, useRef, useState } from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloak";
import { useUserInfo } from "../../context/UserInfoContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import "./DailogBox.css";

const KeycloakWrapper = ({ children }: { children: React.ReactNode }) => {
  const keycloakInitialized = useRef(false);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const { userInfo, refreshUserInfo } = useUserInfo();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("keycloak not initialised");
    if (!keycloakInitialized.current) {
      console.log("keycloak initialised");
      keycloakInitialized.current = true;
      keycloak.onAuthSuccess = async () => {
        if (keycloak?.authenticated && keycloak?.idToken) {
          try {
            await refreshUserInfo(keycloak.idToken);
            setAuthorized(true);
          } catch (error) {
            console.error("Failed to fetch user info:", error);
            setAuthorized(false);
            navigate("/");
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      };
    }
  }, [navigate, refreshUserInfo]);

  useEffect(() => {
    if (userInfo.isWelcome) {
      navigate("/welcome-page");
    }
  }, [userInfo.isWelcome, navigate]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!authorized) {
    return <div>User not authorized</div>;
  }

  return <>{children}</>;
};

const KeycloakProvider = ({ children }: { children: React.ReactNode }) => (
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{ onLoad: "login-required" }}
  >
    <StrictMode>
      <KeycloakWrapper>{children}</KeycloakWrapper>
    </StrictMode>
  </ReactKeycloakProvider>
);

export default KeycloakProvider;
