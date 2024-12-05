declare function getSignInUrl(returnPathname?: string): Promise<string>;
declare function getSignUpUrl(returnPathname?: string): Promise<string>;
declare function signOut(request: Request): Promise<Response>;
export { getSignInUrl, getSignUpUrl, signOut };
