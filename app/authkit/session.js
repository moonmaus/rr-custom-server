import { redirect } from 'react-router';
import { WORKOS_CLIENT_ID, WORKOS_COOKIE_PASSWORD } from './env-variables.js';
import { getSession, destroySession, commitSession } from './cookie.js';
import { getAuthorizationUrl } from './get-authorization-url.js';
import { workos } from './workos.js';
import { sealData, unsealData } from 'iron-session';
import { jwtVerify, createRemoteJWKSet, decodeJwt } from 'jose';
const JWKS = createRemoteJWKSet(new URL(workos.userManagement.getJwksUrl(WORKOS_CLIENT_ID)));
async function updateSession(request, debug) {
    const session = await getSessionFromCookie(request.headers.get('Cookie'));
    // If no session, just continue
    if (!session) {
        return null;
    }
    const hasValidSession = await verifyAccessToken(session.accessToken);
    if (hasValidSession) {
        if (debug)
            console.log('Session is valid');
        return session;
    }
    try {
        if (debug)
            console.log(`Session invalid. Refreshing access token that ends in ${session.accessToken.slice(-10)}`);
        // If the session is invalid (i.e. the access token has expired) attempt to re-authenticate with the refresh token
        const { accessToken, refreshToken } = await workos.userManagement.authenticateWithRefreshToken({
            clientId: WORKOS_CLIENT_ID,
            refreshToken: session.refreshToken,
        });
        if (debug)
            console.log(`Refresh successful. New access token ends in ${accessToken.slice(-10)}`);
        const newSession = {
            accessToken,
            refreshToken,
            user: session.user,
            impersonator: session.impersonator,
            headers: {},
        };
        // Encrypt session with new access and refresh tokens
        const updatedSession = await getSession(request.headers.get('Cookie'));
        updatedSession.set('jwt', await encryptSession(newSession));
        newSession.headers = {
            'Set-Cookie': await commitSession(updatedSession),
        };
        return newSession;
    }
    catch (e) {
        if (debug)
            console.log('Failed to refresh. Deleting cookie and redirecting.', e);
        const cookieSession = await getSession(request.headers.get('Cookie'));
        throw redirect('/', {
            headers: {
                'Set-Cookie': await destroySession(cookieSession),
            },
        });
    }
}
async function encryptSession(session) {
    return sealData(session, { password: WORKOS_COOKIE_PASSWORD });
}
async function authkitLoader(loaderArgs, loaderOrOptions, options = {}) {
    const loader = typeof loaderOrOptions === 'function' ? loaderOrOptions : undefined;
    const { ensureSignedIn = false, debug = false } = typeof loaderOrOptions === 'object' ? loaderOrOptions : options;
    const { request } = loaderArgs;
    const session = await updateSession(request, debug);
    if (!session) {
        if (ensureSignedIn) {
            const returnPathname = getReturnPathname(request.url);
            const cookieSession = await getSession(request.headers.get('Cookie'));
            throw redirect(await getAuthorizationUrl({ returnPathname }), {
                headers: {
                    'Set-Cookie': await destroySession(cookieSession),
                },
            });
        }
        const auth = {
            user: null,
            accessToken: null,
            impersonator: null,
            organizationId: null,
            permissions: null,
            entitlements: null,
            role: null,
            sessionId: null,
            sealedSession: null,
        };
        return await handleAuthLoader(loader, loaderArgs, auth);
    }
    const { sessionId, organizationId = null, role = null, permissions = [], entitlements = [], } = getClaimsFromAccessToken(session.accessToken);
    const cookieSession = await getSession(request.headers.get('Cookie'));
    const auth = {
        user: session.user,
        sessionId,
        accessToken: session.accessToken,
        organizationId,
        role,
        permissions,
        entitlements,
        impersonator: session.impersonator ?? null,
        sealedSession: cookieSession.get('jwt'),
    };
    return await handleAuthLoader(loader, loaderArgs, auth, session);
}
async function handleAuthLoader(loader, args, auth, session) {
    if (!loader) {
        // Return raw object if no loader is provided
        return {
            ...auth,
            ...(session ? { headers: session.headers } : {}),
        };
    }
    // If there's a custom loader, get the resulting data
    const loaderResult = await loader({ ...args, auth: auth });
    if (loaderResult instanceof Response) {
        // If the result is a redirect, return it unedited
        if (loaderResult.status >= 300 && loaderResult.status < 400) {
            return loaderResult;
        }
        const data = await loaderResult.json();
        // Merge data with auth and session cookie if applicable
        return {
            ...data,
            ...auth,
            ...(session ? { "Set-Cookie": session.headers["Set-Cookie"] } : {}),
        };
    }
    // If the loader returns a non-Response, assume it's a data object
    return {
        ...loaderResult,
        ...auth,
        ...(session ? { headers: session.headers } : {}),
    };
}
async function terminateSession(request) {
    const encryptedSession = await getSession(request.headers.get('Cookie'));
    const { accessToken } = (await getSessionFromCookie(request.headers.get('Cookie'), encryptedSession));
    const { sessionId } = getClaimsFromAccessToken(accessToken);
    const headers = {
        'Set-Cookie': await destroySession(encryptedSession),
    };
    if (sessionId) {
        return redirect(workos.userManagement.getLogoutUrl({ sessionId }), {
            headers,
        });
    }
    return redirect('/', {
        headers,
    });
}
function getClaimsFromAccessToken(accessToken) {
    const { sid: sessionId, org_id: organizationId, role, permissions, entitlements, } = decodeJwt(accessToken);
    return {
        sessionId,
        organizationId,
        role,
        permissions,
        entitlements,
    };
}
async function getSessionFromCookie(cookie, session) {
    if (!session) {
        session = await getSession(cookie);
    }
    if (session.has('jwt')) {
        return unsealData(session.get('jwt'), {
            password: WORKOS_COOKIE_PASSWORD,
        });
    }
    else {
        return null;
    }
}
async function verifyAccessToken(accessToken) {
    try {
        await jwtVerify(accessToken, JWKS);
        return true;
    }
    catch (e) {
        return false;
    }
}
function getReturnPathname(url) {
    const newUrl = new URL(url);
    return `${newUrl.pathname}${newUrl.searchParams.size > 0 ? '?' + newUrl.searchParams.toString() : ''}`;
}
export { encryptSession, terminateSession, authkitLoader };
