import { useMutation } from "@tanstack/react-query";

const signUp = async (payload: {
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  currentActiveClubId: string;
  skillLevel: string;
  preferredTime: string;
  membershipTypeId: string;
  file?: File;
}
) => {
const { membershipTypeId, file, ...userJsonFields } = payload;

const formData = new FormData();
formData.append("UserJson", JSON.stringify(userJsonFields));

if (file) {
  formData.append("file", file);
}

const response = await fetch(
  `http://44.216.113.234:8080/users/assign-club-membership/${payload.currentActiveClubId}?membershipTypeId=${membershipTypeId}`,
  {
    method: "POST",
    body: formData,
  }
);

if (!response.ok) {
  const errorMessage = await response.text();
  throw new Error(
    `Error ${response.status}: ${response.statusText} - ${errorMessage}`
  );
}

return await response.text(); // assuming plain string response
};

export const useMutateAddUser = ({
  onSuccessCallback,
  onErrorCallback,
}: {
  onSuccessCallback: (data: any) => void;
  onErrorCallback: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: signUp,
    onSuccess: onSuccessCallback,
    onError: (error: unknown) => {
      console.error("Signup error:", error);
      onErrorCallback(error as Error);
    },
  });
};
