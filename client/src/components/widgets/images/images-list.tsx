import { useMatch } from "@tanstack/react-router";
import { useImages } from "./use-images";
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
  const search = useMatch({
    from: "/images",
  }).search as { page: number; limit: number };
  const { data } = useImages(search.page || 1, search.limit || LIMIT);
  const pages = data
    ? Math.ceil(data?.total_images / (search.limit || LIMIT))
    : 1;

  return (
    <div>
      {/* <EditImage /> */}
      <div className="p-6 flex flex-wrap gap-2">
        {data?.images.map((src, i) => (
          <a href={`${URL}${src}`} key={i}>
            <img
              className="object-contain object-center w-32 h-32 cursor-pointer"
              src={`${URL}${src}`}
              alt="nature image"
            />
          </a>
        ))}
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
