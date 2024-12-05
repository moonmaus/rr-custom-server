import "react-router";
declare module "react-router" {
    interface AppLoadContext {
        VALUE_FROM_EXPRESS: string;
    }
}
export declare const app: import("express-serve-static-core").Express;
