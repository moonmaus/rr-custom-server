import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Link } from 'react-router';
import { signOut } from '~/authkit';
// import { signOut } from '@workos-inc/authkit-react-router';
import { Button, Flex, Heading, Text } from '@radix-ui/themes';
import SignInButton from '~/components/sign-in-button';
import { useRootLoaderData } from '~/root';
export const meta = () => {
    return [
        { title: 'Example AuthKit Authenticated App' },
        {
            name: 'description',
            content: 'Example Remix application demonstrating how to use AuthKit.',
        },
    ];
};
export async function action({ request }) {
    return await signOut(request);
}
export default function Index() {
    const rootLoaderData = useRootLoaderData();
    const { user } = rootLoaderData || {};
    return (_jsx(Flex, { direction: "column", align: "center", gap: "2", children: user ? (_jsxs(_Fragment, { children: [_jsxs(Heading, { size: "8", children: ["Welcome back", user?.firstName && `, ${user?.firstName}`, "."] }), _jsx(Text, { size: "5", color: "gray", children: "You are now authenticated into the application." }), _jsxs(Flex, { align: "center", gap: "3", mt: "4", children: [_jsx(Button, { asChild: true, size: "3", variant: "soft", children: _jsx(Link, { to: "/account", children: "View account" }) }), _jsx(SignInButton, { large: true })] })] })) : (_jsxs(_Fragment, { children: [_jsx(Heading, { size: "8", children: "AuthKit authentication example" }), _jsx(Text, { size: "5", color: "gray", mb: "4", children: "Sign in to view your account details" }), _jsx(SignInButton, { large: true })] })) }));
}
