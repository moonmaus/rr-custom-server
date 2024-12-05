import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, Link } from 'react-router';
import { Button, Flex } from '@radix-ui/themes';
import { useRootLoaderData } from '~/root';
export default function SignInButton({ large = false }) {
    const rootLoaderData = useRootLoaderData();
    const { user, signInUrl } = rootLoaderData || {};
    if (user) {
        return (_jsx(Flex, { gap: "3", children: _jsx(Form, { method: "post", children: _jsx(Button, { type: "submit", size: large ? '3' : '2', children: "Sign Out" }) }) }));
    }
    return (_jsx(Button, { asChild: true, size: large ? '3' : '2', children: _jsxs(Link, { to: signInUrl, children: ["Sign In", large && ' with AuthKit'] }) }));
}
