import { Link, Outlet } from "@tanstack/react-router";

export function RootComponent() {
  return (
    <>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>
        <Link
          to="/message"
          activeProps={{
            className: "font-bold",
          }}
        >
          Message
        </Link>{" "}
        <Link
          to="/images"
          activeProps={{
            className: "font-bold",
          }}
        >
          Images
        </Link>
        <Link
          to="/blog"
          search={{ limit: 10, page: 1 }}
          activeProps={{
            className: "font-bold",
          }}
        >
          Blog
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  );
}
