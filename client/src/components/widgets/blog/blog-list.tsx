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

const LIMIT = 10;

function getFirstTenCharacters(text: string): string {
  return text.substring(0, 10);
}

export function BlogList() {
  const { limit, page } = blogRoute.useSearch();
  const { data } = useMessages(page, limit);

  const pages = data ? Math.ceil(data?.total_messages / (limit || LIMIT)) : 1;

  return (
    <div className="p-6">
      <div>
        <Accordion className="w-full">
          {data?.messages.map((message, i) => (
            <AccordionItem key={i}>
              <AccordionTrigger className="cursor-pointer">
                {getFirstTenCharacters(message)}
              </AccordionTrigger>
              <AccordionContent>{message}</AccordionContent>
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
