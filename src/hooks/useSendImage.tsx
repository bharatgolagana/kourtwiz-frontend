import { useMutation, UseMutationResult } from '@tanstack/react-query';

interface Config {
  onCompleteCallback: (data: unknown) => void;
}

type UploadProps = {
  image: string;
  clubName: string;
};

export const useSendImage = (
  config: Config
): UseMutationResult<unknown, Error, UploadProps> => {
  return useMutation({
    mutationFn: async ({ image, clubName }: UploadProps) => {
      try {
        const response = await fetch("http://127.0.0.1:5000/recognize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image, clubName }),
        });

        const data = await response.json();
        return data;
      } catch (error) {
        return error; 
      }
    },
    onSettled: (data) => {
      config.onCompleteCallback(data);
    },
  });
};
