import { useMatch } from "@tanstack/react-router";
import { useImages } from "./use-images";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
// import { EditImage } from "./edit-image";

const URL = `${import.meta.env.VITE_PUBLIC_DOMAIN}/static/images/`;
const LIMIT = 10;

export function ImagesList() {
  const queryClient = useQueryClient();
  const search = useMatch({
    from: "/images",
  }).search as { page: number; limit: number };
  const { data } = useImages(search.page || 1, search.limit || LIMIT);
  const pages = data
    ? Math.ceil(data?.total_images / (search.limit || LIMIT))
    : 1;
  const deleteImageMutation = useMutation({
    mutationFn: async (filename: string) => {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_DOMAIN}/images/${encodeURIComponent(filename)}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        throw new Error("Failed to delete image");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });

  const handleDeleteImage = async (filename: string) => {
    // const shouldDelete = window.confirm(`Delete "${filename}"?`);
    // if (!shouldDelete) {
    //   return;
    // }
    await deleteImageMutation.mutateAsync(filename);
  };

  return (
    <div>
      {/* <EditImage /> */}
      <div className="p-6 flex flex-wrap gap-2">
        {data?.images.map((src, i) => {
          const filename = Array.isArray(src) ? src[0] : src;
          return (
            <div key={`${filename}-${i}`} className="relative">
              <a href={`${URL}${filename}`} target="_blank">
                <img
                  className="object-contain object-center w-32 h-32 cursor-pointer"
                  src={`${URL}${filename}`}
                  alt="image file"
                />
              </a>
              <button
                type="button"
                aria-label={`Delete ${filename}`}
                onClick={() => handleDeleteImage(filename)}
                disabled={deleteImageMutation.isPending}
                className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white hover:bg-black disabled:opacity-50"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
      <Pagination>
        <PaginationContent>
          {[
            ...Array.from({ length: pages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href={`?page=${i + 1}`}
                  isActive={i + 1 === search.page}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            )),
          ]}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
