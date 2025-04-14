import { useMutation, UseMutationResult } from "@tanstack/react-query";

interface Config {
  onCompleteCallback: (data: unknown) => void;
  onErrorCallback?: (error: Error) => void;
  onMessageCallback?: (data: any) => void;
}

type UploadProps = {
  images: string[];
  clubId: string;
  clubName: string;
};
export const useSendImage = (
  config: Config
): UseMutationResult<unknown, Error, UploadProps> => {
  return useMutation({
    mutationFn: async ({ images, clubName, clubId }: UploadProps) => {
      const response = await fetch("http://44.216.113.234:5000/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images, clubName, clubId }),
      });

      
      if (!response.ok) {
        const errorText = await response.text();
        let finalParsed = JSON.parse(errorText);
        return finalParsed; 
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let lastMessage: any = null; 

      if (!reader) {
        throw new Error("No readable stream from response");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);

          if (line) {
            try {
              const parsed = JSON.parse(line);
              lastMessage = parsed; 
              config.onMessageCallback?.(parsed);
            } catch (err) {
              console.warn("❗️Could not parse streamed line:", line);
            }
          }
        }
      }

      if (lastMessage) {
        if (lastMessage.status === "success") {
          return { status: "success", message: lastMessage.message }; 
        } else {
          throw new Error(lastMessage.message || "Unknown error occurred");
        }
      }

      return { status: "done" };
    },

    onSuccess: (data) => {
      config.onCompleteCallback(data);
    },
    onError: (error) => {
      console.error("❌ Upload failed:", error);
      config.onErrorCallback?.(error);
    },
  });
};
