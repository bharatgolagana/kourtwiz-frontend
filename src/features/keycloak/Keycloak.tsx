import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "https://auth.notiev.com",
  realm: "zeta-realm",
  clientId: "kourtwiz-frontend",
});

export default keycloak;
