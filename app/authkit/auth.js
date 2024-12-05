import { getAuthorizationUrl } from './get-authorization-url.js';
import { terminateSession } from './session.js';
async function getSignInUrl(returnPathname) {
    return getAuthorizationUrl({ returnPathname, screenHint: 'sign-in' });
}
async function getSignUpUrl(returnPathname) {
    return getAuthorizationUrl({ returnPathname, screenHint: 'sign-up' });
}
async function signOut(request) {
    return await terminateSession(request);
}
export { getSignInUrl, getSignUpUrl, signOut };
