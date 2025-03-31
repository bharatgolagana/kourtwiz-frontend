import { useMutation } from "@tanstack/react-query";

const signUp = async ({
  name,
  email,
  phoneNumber,
  password,
  profilePictureUrl,
  dateOfBirth,
  gender,
  address,
  city,
  state,
  country,
  zipCode,
  currentActiveClubId,
  skillLevel,
  preferredTime,
  membershipTypeId,
}: {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  profilePictureUrl: string | undefined;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  currentActiveClubId: string,
  skillLevel: string,
  preferredTime: string,
  membershipTypeId: string;
}) => {
  const response = await fetch(`http://44.216.113.234:8080/users/assign-club-membership/${currentActiveClubId}?membershipTypeId=${membershipTypeId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    body: JSON.stringify({
      name,
      email,
      phoneNumber, 
      password,
      profilePictureUrl,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      country,
      zipCode,
      currentActiveClubId,
      skillLevel,
      preferredTime,
    }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      `Error ${response.status}: ${response.statusText} - ${errorMessage}`
    );
  }

  return response;
};
export const useMutateSignUpMember = ({
  onSuccessCallback,
  onErrorCallback,
}: {
  onSuccessCallback: (data: any) => void;
  onErrorCallback: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: signUp,
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
  });
};
