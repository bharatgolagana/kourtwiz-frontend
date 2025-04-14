import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type AddFaceVariables = {
  name: string;
  base64Image: string;
};

const addFace = async ({ name, base64Image }: AddFaceVariables): Promise<any> => {
  const response = await fetch("http://44.216.113.234:5000/add-face", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, image: base64Image }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      `Python backend error ${response.status}: ${response.statusText} - ${errorMessage}`
    );
  }

  return response.json();
};

export const useAddFaceMutation = (
  options?: UseMutationOptions<any, Error, AddFaceVariables>
) => {
  return useMutation<any, Error, AddFaceVariables>({
    mutationFn: addFace,
    ...options,
  });
};
