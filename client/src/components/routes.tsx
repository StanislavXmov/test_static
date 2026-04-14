import type { QueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { RootComponent } from "./root-component";
import {
  createRootRouteWithContext,
  createRoute,
  Link,
} from "@tanstack/react-router";
import { Home } from "./pages/home";
import { Images } from "./pages/images";
import { Message } from "./pages/message";
import { Blog } from "./pages/blog";

export const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  },
});

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

export const imagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/images",
  component: Images,
});

export const messageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/message",
  component: Message,
});

const blogSearchSchema = z.object({
  page: z.number().catch(1),
  limit: z.number().catch(10),
});

export const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: Blog,
  validateSearch: blogSearchSchema.parse,
});
