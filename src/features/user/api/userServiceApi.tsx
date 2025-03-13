import { useUserInfo } from "../../../context/UserInfoContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = "http://localhost:5001";

interface Profile {
  _id: string;
  profile: string;
  status: boolean;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Role {
  _id: string;
  role: string;
  status: boolean;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useProfiles = () => {
  return useQuery<Profile[], Error>({
    queryKey: ["Profiles"],
    queryFn: async () => {
      const { data } = await axios.get<Profile[]>(
        `${API_BASE_URL}/settings/user/getProfiles`
      );
      return data;
    },
  });
};

export const useRoles = () => {
  return useQuery<Role[], Error>({
    queryKey: ["Roles"],
    queryFn: async () => {
      const { data } = await axios.get<Role[]>(
        `${API_BASE_URL}/roles`
      );
      return data;
    },
  });
};

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profile: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useCreateUser = (_p0: {
  onError: (error: unknown) => void;
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfo();
  const createdBy = userInfo.userId;
  const organizationId = userInfo.selectedOrganization;

  return useMutation<User, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      formData.append("createdBy", createdBy || "");
      formData.append("organizationId", organizationId || "");

      const response = await axios.post<User>(
        `${API_BASE_URL}/user`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Profiles"] });
      queryClient.invalidateQueries({ queryKey: ["Roles"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
    onError: (error: any) => {
      console.error("Error creating user:", error.message);
      if (error.response && error.response.status === 409) {
        toast.error("User already exists with the same email");
      } else if (error.response?.status === 403) {
        toast.error(
          "User creation limit reached. Please contact the administrator for assistance."
        );
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
};

interface User {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  primaryNumber?: string;
  secondaryNumber?: string;
  organizationId: string;
  role: string;
  gender?: string;
  employeeNo?: string;
  identificationNo?: string;
  bookingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  profileImages: string;
}

interface UsersResponse {
  users: User[];
  totalUsers: number;
  pageIndex: number;
  pageSize: number;
}

export const useUsers = (
  pageIndex: number,
  pageSize: number,
  search: string = "",
  userId: string
) => {
  const { userInfo } = useUserInfo();
  return useQuery<UsersResponse, Error>({
    queryKey: ["users", pageIndex, pageSize, search, userId],
    queryFn: async () => {
      const userId = userInfo.userId;
      const { data } = await axios.get<UsersResponse>(`${API_BASE_URL}/user`, {
        params: { pageIndex, pageSize, search, userId },
      });
      return data;
    },
  });
};

interface User {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  primaryNumber?: string;
  secondaryNumber?: string;
  organizationId: string;
  role: string;
  gender?: string;
  employeeNo?: string;
  identificationNo?: string;
  bookingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfo();

  return useMutation<void, Error, string>({
    mutationFn: async (userId: string) => {
      const { userId: loggedInUserId, selectedOrganization: organizationId } =
        userInfo;
      if (!loggedInUserId || !organizationId) {
        throw new Error("Logged-in user ID and organization ID are required.");
      }
      await axios.delete(`${API_BASE_URL}/user/${userId}`, {
        data: { loggedInUserId, organizationId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      console.error("Error deleting user:", error.message);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfo();
  const loggedInUserId = userInfo?.userId;
  const organizationId = userInfo?.selectedOrganization;

  return useMutation<User, Error, { data: Partial<User>; file?: File }>({
    mutationFn: async ({ data, file }) => {
      if (!loggedInUserId || !organizationId) {
        throw new Error("Missing user or organization context.");
      }

      const formData = new FormData();
      formData.append("loggedInUserId", loggedInUserId);
      formData.append("organizationId", organizationId);
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value as string);
        }
      });
      if (file) {
        formData.append("profileImage", file);
      }

      const response = await axios.put<User>(
        `${API_BASE_URL}/user/${data._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      console.error("Error updating user:", error.message);
    },
  });
};

export const useGetUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/user/${userId}`);
      return data;
    },
    enabled: !!userId,
  });
};
