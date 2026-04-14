import { blogRoute } from "@/components/routes";
import { useMessages } from "./use-messages";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { XIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LIMIT = 10;

function getFirstTenCharacters(text: string): string {
  return text.substring(0, 10);
}

export function BlogList() {
  const queryClient = useQueryClient();
  const { limit, page } = blogRoute.useSearch();
  const { data } = useMessages(page, limit);

  const pages = data ? Math.ceil(data?.total_messages / (limit || LIMIT)) : 1;

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_DOMAIN}/messages/${id}`,
        { method: "DELETE" },
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const handleDeleteMessage = async (id: number) => {
    await deleteMessageMutation.mutateAsync(id);
  };

  return (
    <div className="p-6">
      <div>
        <Accordion className="w-full">
          {data?.messages.map((message, i) => (
            <AccordionItem key={i}>
              <AccordionTrigger className="cursor-pointer flex items-center justify-between gap-4">
                {getFirstTenCharacters(message.message)}{" "}
                <span
                  aria-label={`Delete ${message.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMessage(message.id);
                  }}
                  className="rounded-full bg-black/70 p-1 text-white hover:bg-black disabled:opacity-50"
                >
                  <XIcon className="h-3 w-3" />
                </span>
              </AccordionTrigger>
              <AccordionContent>{message.message}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <Pagination>
        <PaginationContent>
          {[
            ...Array.from({ length: pages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href={`?page=${i + 1}`}
                  isActive={i + 1 === page}
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
