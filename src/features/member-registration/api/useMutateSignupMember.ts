import { useMutation } from '@tanstack/react-query';

const signUp = async ({
  name,
  email,
  phone,
  password,
  organizationId,
}: {
  name: string;
  email: string;
  phone: string;
  password: string;
  organizationId: string;
}) => {
  const response = await fetch(
    `http://44.216.113.234:8080/temp-users?organizationId=${organizationId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
      }),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(responseText || 'Failed to assign role');
  }

  return responseText;
};

export const useMutateSignUpMember = ({
  onSuccessCallback,
  onErrorCallback,
}) => {
  return useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      onSuccessCallback(data);
    },
    onError: (error) => {
      onErrorCallback(error);
    },
  });
};
