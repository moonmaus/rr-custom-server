import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import type { Route } from './+types/root';
export declare const links: Route.LinksFunction;
export declare const loader: (args: LoaderFunctionArgs) => Promise<import("./authkit/session").TypedResponse<{
    signInUrl: string;
} & (import("./authkit/interfaces").AuthorizedData | import("./authkit/interfaces").UnauthorizedData)>>;
export declare function useRootLoaderData(): {
    clone: undefined;
    text: undefined;
    readonly body: {
        readonly locked: boolean;
        cancel: undefined;
        getReader: undefined;
        pipeThrough: undefined;
        pipeTo: undefined;
        tee: undefined;
    } | null;
    readonly type: ResponseType;
    readonly headers: {
        append: undefined;
        delete: undefined;
        get: undefined;
        getSetCookie: undefined;
        has: undefined;
        set: undefined;
        forEach: undefined;
        entries: undefined;
        keys: undefined;
        values: undefined;
        [Symbol.iterator]: undefined;
    };
    readonly status: number;
    readonly url: string;
    formData: undefined;
    readonly ok: boolean;
    readonly redirected: boolean;
    readonly statusText: string;
    readonly bodyUsed: boolean;
    arrayBuffer: undefined;
    blob: undefined;
    bytes: undefined;
    json: undefined;
} | undefined;
export declare function action({ request }: ActionFunctionArgs): Promise<Response>;
export declare function Layout({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export default function App(): import("react/jsx-runtime").JSX.Element;
export declare function ErrorBoundary({ error }: Route.ErrorBoundaryProps): import("react/jsx-runtime").JSX.Element;
