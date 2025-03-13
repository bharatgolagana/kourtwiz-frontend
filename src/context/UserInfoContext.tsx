import React, { createContext, useContext, useState, JSX } from "react";
import { fetchUserDetails } from "./contextApi";

export type UserPermissions = {
  roleId: string;
  taskId: string;
  taskName: string;
  taskValue: string;
  enable: boolean;
};
export type UserInfo = {
  role: string;
  userId: string | undefined;
  selectedOrganization?: string;
  organizations: string[] | undefined;
  authorities: UserPermissions[];
  isInternalUser: boolean | undefined;
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  userName?: string;
  userPermissions?: UserPermissions[];
  bookingUrl?: string;
  isWelcome?: boolean;
  mobileNumber?: string;
  paymentStatus?: string;
  razorpayOrderId?: string;
  planStatus?: string;
  planType?: string;
  planPeriod?: string;
  planExpiryDate?: string;
  isAccountDetailsFilled?: boolean;
  renewSubscription?: object;
  profile: object;
  paymentDate?: string;
  createdBy?: string;
  accountOnHold?: AccountOnHold;
};
export type AccountOnHold = {
  status: boolean;
  message: string;
};
export const initialState: UserInfo = {
  userId: undefined,
  selectedOrganization: undefined,
  createdBy: undefined,
  authorities: [],
  isInternalUser: undefined,
  organizations: [],
  isActive: false,
  role: "",
  userPermissions: [],
  isWelcome: false,
  paymentStatus: "",
  razorpayOrderId: undefined,
  planStatus: undefined,
  planType: undefined,
  planPeriod: undefined,
  planExpiryDate: undefined,
  isAccountDetailsFilled: false,
  renewSubscription: {},
  profile: {},
};

interface UserInfoContextType {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  updateIsWelcome: (value: boolean) => void;
  refreshUserInfo: (value: string) => void;
}

export const UserInfoContext = createContext<UserInfoContextType | undefined>(
  undefined
);
UserInfoContext.displayName = "UserInfoContext";

export function UserInfoProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [userInfo, setUserInfo] = useState<UserInfo>(initialState);
  const refreshUserInfo = async (token: string) => {
    try {
      const userInfo = await fetchUserDetails(token);
      setUserInfo(userInfo);
    } catch (error) {
      console.error("Failed to refresh user info:", error);
    }
  };

  const updateIsWelcome = (value: boolean) => {
    setUserInfo((prev) => ({
      ...prev,
      isWelcome: value,
    }));
  };

  return (
    <UserInfoContext.Provider
      value={{ userInfo, setUserInfo, refreshUserInfo, updateIsWelcome }}
    >
      {children}
    </UserInfoContext.Provider>
  );
}

export function useUserInfo(): UserInfoContextType {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error("useUserInfo must be used within a UserInfoProvider");
  }
  return context;
}
