import type { LoaderFunctionArgs } from 'react-router';
import type { AuthorizedData, UnauthorizedData, AuthKitLoaderOptions, Session } from './interfaces.js';
export type TypedResponse<T = unknown> = Omit<Response, "json"> & {
    json(): Promise<T>;
};
declare function encryptSession(session: Session): Promise<string>;
type LoaderValue<Data> = Response | TypedResponse<Data> | NonNullable<Data> | null;
type LoaderReturnValue<Data> = Promise<LoaderValue<Data>> | LoaderValue<Data>;
type AuthLoader<Data> = (args: LoaderFunctionArgs & {
    auth: AuthorizedData | UnauthorizedData;
}) => LoaderReturnValue<Data>;
type AuthorizedAuthLoader<Data> = (args: LoaderFunctionArgs & {
    auth: AuthorizedData;
}) => LoaderReturnValue<Data>;
declare function authkitLoader(loaderArgs: LoaderFunctionArgs, options: AuthKitLoaderOptions & {
    ensureSignedIn: true;
}): Promise<TypedResponse<AuthorizedData>>;
declare function authkitLoader(loaderArgs: LoaderFunctionArgs, options?: AuthKitLoaderOptions): Promise<TypedResponse<AuthorizedData | UnauthorizedData>>;
declare function authkitLoader<Data = unknown>(loaderArgs: LoaderFunctionArgs, loader: AuthorizedAuthLoader<Data>, options: AuthKitLoaderOptions & {
    ensureSignedIn: true;
}): Promise<TypedResponse<Data & AuthorizedData>>;
declare function authkitLoader<Data = unknown>(loaderArgs: LoaderFunctionArgs, loader: AuthLoader<Data>, options?: AuthKitLoaderOptions): Promise<TypedResponse<Data & (AuthorizedData | UnauthorizedData)>>;
declare function terminateSession(request: Request): Promise<Response>;
export { encryptSession, terminateSession, authkitLoader };
