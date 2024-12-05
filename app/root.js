import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, isRouteErrorResponse, Links, Link, Meta, Outlet, Scripts, ScrollRestoration, useRouteLoaderData } from 'react-router';
import { getSignInUrl, signOut, authkitLoader } from '~/authkit';
import Footer from '~/components/footer';
import stylesheet from "./app.css?url";
import themes from '@radix-ui/themes/styles.css?url';
import { Theme, Card, Container, Flex, Button, Box } from '@radix-ui/themes';
export const links = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    },
    { rel: "stylesheet", href: stylesheet },
    { rel: 'stylesheet', href: themes }
];
export const loader = (args) => authkitLoader(args, async () => {
    const signInUrl = await getSignInUrl();
    return { signInUrl };
}, { debug: true });
export function useRootLoaderData() {
    return useRouteLoaderData('root');
}
export async function action({ request }) {
    return await signOut(request);
}
function SignInButton({ large = false }) {
    const rootLoaderData = useRootLoaderData();
    const { user, signInUrl } = rootLoaderData || {};
    if (user) {
        return (_jsx(Flex, { gap: "3", children: _jsx(Form, { method: "post", children: _jsx(Button, { type: "submit", size: large ? '3' : '2', children: "Sign Out" }) }) }));
    }
    if (!signInUrl) {
        return _jsx("span", { children: "Loading..." });
    }
    return (_jsx(Button, { asChild: true, size: large ? '3' : '2', children: _jsxs(Link, { to: signInUrl, children: ["Sign In", large && ' with AuthKit'] }) }));
}
export function Layout({ children }) {
    return (_jsxs("html", { lang: "en", children: [_jsxs("head", { children: [_jsx("meta", { charSet: "utf-8" }), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }), _jsx(Meta, {}), _jsx(Links, {})] }), _jsxs("body", { children: [_jsx(Theme, { accentColor: "iris", panelBackground: "solid", style: { backgroundColor: 'var(--gray-1)' }, children: _jsx(Container, { style: { backgroundColor: 'var(--gray-1)' }, children: _jsxs(Flex, { direction: "column", gap: "5", p: "5", height: "100vh", children: [_jsx(Box, { asChild: true, flexGrow: "1", children: _jsx(Card, { size: "4", children: _jsxs(Flex, { direction: "column", height: "100%", children: [_jsx(Flex, { asChild: true, justify: "between", children: _jsxs("header", { children: [_jsx(Flex, { gap: "4", children: _jsx(Button, { asChild: true, variant: "soft", children: _jsx(Link, { to: "/", children: "Home" }) }) }), _jsx(SignInButton, {})] }) }), _jsx(Flex, { flexGrow: "1", align: "center", justify: "center", children: _jsx("main", { children: children }) })] }) }) }), _jsx(Footer, {})] }) }) }), _jsx(ScrollRestoration, {}), _jsx(Scripts, {})] })] }));
}
export default function App() {
    return _jsx(Outlet, {});
}
export function ErrorBoundary({ error }) {
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack;
    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details =
            error.status === 404
                ? "The requested page could not be found."
                : error.statusText || details;
    }
    else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }
    return (_jsxs("main", { className: "pt-16 p-4 container mx-auto", children: [_jsx("h1", { children: message }), _jsx("p", { children: details }), stack && (_jsx("pre", { className: "w-full p-4 overflow-x-auto", children: _jsx("code", { children: stack }) }))] }));
}
