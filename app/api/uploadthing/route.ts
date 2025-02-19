"use server";
import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "../../../lib/core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
