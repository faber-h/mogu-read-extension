import { createHashRouter } from "react-router";

import App from "@/App";
import { ROUTES } from "@/constants/paths";
import DeclutterMode from "@/pages/DeclutterMode/DeclutterMode";
import FocusMode from "@/pages/FocusMode/FocusMode";

const router = createHashRouter([
  {
    path: ROUTES.DECLUTTER,
    Component: App,
    children: [
      {
        path: ROUTES.DECLUTTER,
        Component: DeclutterMode,
      },
      {
        path: ROUTES.FOCUS,
        Component: FocusMode,
      },
    ],
  },
]);

export default router;
