import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useLoaderData } from 'react-router';
import { authkitLoader } from '~/authkit';
// import { authkitLoader } from '@workos-inc/authkit-react-router';
import { Text, Heading, TextField, Flex, Box } from '@radix-ui/themes';
export const loader = (args) => authkitLoader(args, async () => {
    return { ensureSignedIn: true };
}, { debug: true });
export default function AccountPage() {
    const { user, role } = useLoaderData();
    const userFields = [
        ['First name', user.firstName],
        ['Last name', user.lastName],
        ['Email', user.email],
        ['Id', user.id],
        role ? ['Role', role] : [],
    ].filter((arr) => arr.length > 0);
    return (_jsxs(_Fragment, { children: [_jsxs(Flex, { direction: "column", gap: "2", mb: "7", children: [_jsx(Heading, { size: "8", align: "center", children: "Account details" }), _jsx(Text, { size: "5", align: "center", color: "gray", children: "Below are your account details" })] }), userFields && (_jsx(Flex, { direction: "column", justify: "center", gap: "3", width: "400px", children: userFields.map(([label, value]) => (_jsx(Flex, { asChild: true, align: "center", gap: "6", children: _jsxs("label", { children: [_jsx(Text, { weight: "bold", size: "3", style: { width: 100 }, children: label }), _jsx(Box, { flexGrow: "1", children: _jsx(TextField.Root, { value: value || '', readOnly: true }) })] }) }, value))) }))] }));
}
