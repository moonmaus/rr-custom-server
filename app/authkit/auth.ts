import { getAuthorizationUrl } from './get-authorization-url.js';
import { terminateSession } from './session.js';

async function getSignInUrl(returnPathname?: string) {

  const url = await getAuthorizationUrl({ returnPathname, screenHint: 'sign-in' });
  return url;

  // return getAuthorizationUrl({ returnPathname, screenHint: 'sign-in' });
}

async function getSignUpUrl(returnPathname?: string) {
  return getAuthorizationUrl({ returnPathname, screenHint: 'sign-up' });
}

async function signOut(request: Request) {
  return await terminateSession(request);
}

export { getSignInUrl, getSignUpUrl, signOut };
