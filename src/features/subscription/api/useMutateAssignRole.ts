import { useMutation, useQueryClient } from '@tanstack/react-query';

const assignRole = async ({
  userEmail,
  organizationName,
  roleName,
}: {
  userEmail: string;
  organizationName: string;
  roleName: string;
}) => {
  const token = localStorage.getItem('jwtToken');

  console.log('assigning role:', {
    userEmail,
    organizationName,
    roleName,
  });

  const response = await fetch('http://44.216.113.234:8080/users/assign-role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userEmail,
      organizationName,
      roleName,
    }),
  });

  console.log('response:', response);

  const responseText = await response.text();

  if (!response.ok) {
    console.log('throwing error!');
    throw new Error(responseText || 'Failed to assign role');
  }

  console.log('success!');
  return responseText; // <- Return raw text
};

export const useMutateAssignRole = ({ onSuccessCallback, onErrorCallback }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignRole,
    onSuccess: (data) => {
      console.log('success callback!', data);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      onSuccessCallback(data); // <- Pass back response text
    },
    onError: (error) => {
      console.log('error callback', error);
      onErrorCallback(error);
    },
  });
};
