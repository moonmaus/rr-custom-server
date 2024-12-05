import type { LoaderFunctionArgs } from 'react-router';
export declare const loader: (args: LoaderFunctionArgs) => Promise<import("../authkit/session").TypedResponse<{
    ensureSignedIn: boolean;
} & (import("../authkit/interfaces").AuthorizedData | import("../authkit/interfaces").UnauthorizedData)>>;
export default function AccountPage(): import("react/jsx-runtime").JSX.Element;
