import "react-router";
import { createRequestHandler } from "@react-router/express";
import express from "express";
export const app = express();
app.use(createRequestHandler({
    // @ts-expect-error - virtual module provided by React Router at build time
    build: () => import("virtual:react-router/server-build"),
    getLoadContext() {
        return {
            VALUE_FROM_EXPRESS: "Hello from Express",
        };
    },
}));
