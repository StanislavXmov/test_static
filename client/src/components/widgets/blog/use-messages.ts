import { useQuery } from "@tanstack/react-query";

export function useMessages(page: number = 0, limit: number = 5) {
  return useQuery({
    queryKey: ["messages"],
    queryFn: async (): Promise<{
      messages: string[];
      total_messages: number;
    }> => {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_DOMAIN}/blog/?page=${page}&limit=${limit}`,
      );
      return await response.json();
    },
  });
}
