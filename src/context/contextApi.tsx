import axios from "axios";
import { UserInfo } from "./UserInfoContext";

export async function fetchUserDetails(token: string): Promise<UserInfo> {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      userId: data.userId,
      selectedOrganization: data.organizationId,
      authorities: data.permissions,
      isInternalUser: !data.isVisitor,
      organizations: [data.organizationId],
      isActive: data.userStatus === "active",
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      userName: data.userName,
      role: data.role,
      isWelcome: data.isWelcome,
      mobileNumber: data.primaryNumber,
      paymentStatus: data.paymentStatus,
      razorpayOrderId: data.razorpayOrderId,
      planStatus: data.planStatus,
      planType: data.planType,
      planPeriod: data.planPeriod,
      planExpiryDate: data.planExpiryDate,
      isAccountDetailsFilled: data.isAccountDetailsFilled,
      renewSubscription: data?.renewSubscription,
      profile: data?.profile,
      paymentDate: data?.paymentDate,
      createdBy: data?.createdBy,
      accountOnHold: {
        status: data.accountOnHold?.status,
        message: data.accountOnHold?.message,
      },
    };
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    throw error;
  }
}
