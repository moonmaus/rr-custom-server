# Type inference

Date: 2024-09-20

Status: accepted

Supersedes [#0003](./0003-infer-types-for-useloaderdata-and-useactiondata-from-loader-and-action-via-generics.md)

## Context

Now that Remix is being merged upstream into React Router, we have an opportunity to revisit our approach to typesafety.

### Type inference

There are three major aspects to typesafety in a framework like React Router:

1. **Type inference from the route config**

   Some types are defined in the route config (`routes.ts`) but need to be inferred within a route module.

   For example, let's look at URL path parameters.
   Remix had no mechanism for inferring path parameters as that information is not present _within_ a route module.
   If a route's URL path was `/products/:id`, you'd have to manually specify `"id"` as a valid path parameter within that route module:

   ```ts
   const params = useParams<"id">();
   params.id;
   ```

   This generic was nothing more than a convenient way to do a type cast.
   You could completely alter the URL path for a route module, typechecking would pass, but then you would get runtime errors.

2. **Type inference within a route**

   Some types are defined within a route module but need to be inferred across route exports.

   For example, loader data is defined by the return type of `loader` but needs to be accessed within the `default` component export:

   ```ts
   export function loader() {
     // define here 👇
     return { planet: "world" };
   }

   export default function Component() {
     // access here 👇
     const data = useLoaderData<typeof loader>();
   }
   ```

   Unlike the `useParams` generic, this isn't just a type cast.
   The `useLoaderData` generic ensures that types account for serialization across the network.
   However, it still requires you to add `typeof loader` every time.

   Not only that, but complex routes get very tricky to type correctly.
   For example, `clientLoader`s don't run during the initial SSR render, but you can force the `clientLoader` data to always be present in your route component if you set `clientLoader.hydrate = true` _and_ provide a `HydrateFallback`.
   Here are a couple cases that trip up most users:

   | `loader` | `clientLoader` | `clientLoader.hydrate` | `HydrateFallback` | Generic for `useLoaderData`            |
   | -------- | -------------- | ---------------------- | ----------------- | -------------------------------------- |
   | ✅       | ❌             | `false`                | ❌                | `typeof loader`                        |
   | ❌       | ✅             | `false`                | ❌                | `typeof clientLoader \| undefined`     |
   | ✅       | ✅             | `false`                | ❌                | `typeof loader \| typeof clientLoader` |
   | ✅       | ✅             | `true`                 | ❌                | `typeof loader \| typeof clientLoader` |
   | ✅       | ✅             | `true`                 | ✅                | `typeof clientLoader`                  |

   The generic for `useLoaderData` starts to feel a lot like doing your taxes: there's only one right answer, Remix knows what it is, but you're going to get quizzed on it anyway.

3. **Type inference across routes**

   Some types are defined in one route module but need to be inferred in another route module.
   This is common when wanting to access loader data of matched routes like when using `useMatches` or `useRouteLoaderData`.

   ```ts
   import type { loader as otherLoader } from "../other-route.ts";
   // hope the other route is also matched 👇 otherwise this will error at runtime
   const otherData = useRouteLoaderData<typeof otherLoader>();
   ```

   Again, its up to you to wire up the generics with correct types.
   In this case you need to know both types defined in the route config (to know which routes are matched) and types defined in other route modules (to know the loader data for those routes).

In practice, Remix's generics work fine most of the time.
But they are mostly boilerplate and can become error-prone as the app scales.
An ideal solution would infer types correctly on your behalf, doing away with tedious generics.

## Goals

- Type inference from the route config (`routes.ts`)
- Type inference within a route
- Type inference across routes
- Same code path for type inference whether using programmatic routing or file-based routing
- Compatibility with standard tooling for treeshaking, HMR, etc.
- Minimal impact on runtime API design

## Decisions

### Route exports API

Keep the route module export API as is.
Route modules should continue to export separate values for `loader`, `clientLoader`, `action`, `ErrorBoundary`, `default` component, etc.
That way standard transforms like treeshaking and React Fast Refresh (HMR) work out-of-the-box.

Additionally, this approach introduces no breaking changes allowing Remix users to upgrade to React Router v7 more easily.

### Pass path params, loader data, and action data as props

Hooks like `useParams`, `useLoaderData`, and `useActionData` are defined once in `react-router` and are meant to be used in _any_ route.
Without any coupling to a specific route, inferring route-specific types becomes impossible and would necessitate user-supplied generics.

Instead, each route export should be provided route-specific args:

```ts
// Imagine that we *somehow* had route-specific types for:
// - LoaderArgs
// - ClientLoaderArgs
// - DefaultProps

export function loader({ params }: LoaderArgs) {}

export function clientLoader({ params, serverLoader }: ClientLoaderArgs) {}

export default function Component({
  params,
  loaderData,
  actionData,
}: DefaultProps) {
  // ...
}
```

We'll keep those hooks around for backwards compatibility, but eventually the aim is to deprecate and remove them.
We can design new, typesafe alternatives for any edge cases.

### Typegen

While React Router will default to programmatic routing, it can easily be configured for file-based routing.
That means that sometimes route URLs will only be represented as file paths.
Unfortunately, TypeScript cannot use the filesystem as part of its type inference nor type checking.
The only tenable way to infer types based on file paths is through code generation.

We _could_ have typegen just for file-based routing, but then we'd need to maintain a separate code path for type inference in programmatic routing.
To keep things simple, React Router treats any value returned by `routes.ts` the same; it will not make assumptions about _how_ those routes were constructed and will run typegen in all cases.

To that end, React Router will generate types for each route module into a special, gitignored `.react-router` directory.
For example:

```txt
- .react-router/
  - types/
    - app/
      - routes/
        - +types.product.ts
- app/
  - routes/
    - product.tsx
```

The path within `.react-router/types` purposefully mirrors the path to the corresponding route module.
By setting things up like this, we can use `tsconfig.json`'s [rootDirs](https://www.typescriptlang.org/tsconfig/#rootDirs) option to let you conveniently import from the typegen file as if it was a sibling:

```ts
// app/routes/product.tsx
import { LoaderArgs, DefaultProps } from "./+types.product";
```

TypeScript will even give you import autocompletion for the typegen file and the `+` prefix helps to distinguish it as a special file.
Big thanks to Svelte Kit for showing us that [`rootDirs` trick](https://svelte.dev/blog/zero-config-type-safety#virtual-files)!

### Watch mode

Typegen solutions often receive criticism due to typegen'd files becoming out of sync during development.
This happens because many typegen solutions require you to then rerun a script to update the typegen'd files.

Instead, we'll provide a `--watch` flag for the `react-router typegen` command to automatically regenerate types as files change.
It's also straightforward to automatically run commands like `react-router typegen --watch` when opening up any modern editors.

In the future, we may also kick off typegen watching as part of running a React Router dev server.
