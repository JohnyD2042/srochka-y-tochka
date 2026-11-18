import { createFileRoute, redirect } from "@tanstack/react-router";

// Старый адрес конкурса 2027: страница переехала на главную (/).
export const Route = createFileRoute("/konkurs2027")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
