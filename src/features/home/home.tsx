import React from "react";
import "./home.css";

import { useUserInfo } from "../../context/UserInfoContext";

const Home: React.FC = () => {
  const { userInfo } = useUserInfo();

  return (
    <div className="homePage--main-container">
      <p>{userInfo.firstName}</p>
    </div>
  );
};

export default Home;
