import { createHashRouter } from "react-router";

import App from "@/App";

const router = createHashRouter([
  {
    path: "/",
    Component: App,
  },
]);

export default router;
