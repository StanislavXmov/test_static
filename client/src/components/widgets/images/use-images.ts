import { useQuery } from "@tanstack/react-query";

export function useImages(page: number = 0, limit: number = 5) {
  return useQuery({
    queryKey: ["images"],
    queryFn: async (): Promise<{ images: string[]; total_images: number }> => {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_DOMAIN}/images/?page=${page}&limit=${limit}`,
      );
      return await response.json();
    },
  });
}
