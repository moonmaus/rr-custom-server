import { route, index } from "@react-router/dev/routes";
export default [
    index("routes/_index.tsx"),
    route("account", "routes/account.tsx"),
    route("callback", "routes/callback.ts"),
    // route("auth/callback", "routes/auth/callback.ts"),
    // route("auth/sign-in", "routes/auth/sign-in.tsx"),
];
// import {
//   type RouteConfig,
//   route,
//   index,
//   layout,
//   prefix,
// } from "@react-router/dev/routes";
// export default [
//   index("./home.tsx"),
//   route("about", "./about.tsx"),
//   layout("./auth/layout.tsx", [
//     route("login", "./auth/login.tsx"),
//     route("register", "./auth/register.tsx"),
//   ]),
//   ...prefix("concerts", [
//     index("./concerts/home.tsx"),
//     route(":city", "./concerts/city.tsx"),
//     route("trending", "./concerts/trending.tsx"),
//   ]),
// ] satisfies RouteConfig;
