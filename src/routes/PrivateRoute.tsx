import { UserInfoProvider } from "../context/UserInfoContext";
import KeycloakProvider from "../features/keycloak/KeycloakProvider";

import Sidebar from "../features/sidebar/Sidebar";

function PrivateRoute(): JSX.Element {
  return (
    <UserInfoProvider>
      <KeycloakProvider>
        <Sidebar />
      </KeycloakProvider>
    </UserInfoProvider>
  );
}

export default PrivateRoute;
