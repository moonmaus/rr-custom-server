import type { Route } from "./+types/account";

import { useLoaderData } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { authkitLoader } from '~/authkit';
// import { authkitLoader } from '@workos-inc/authkit-react-router';
import { Text, Heading, TextField, Flex, Box } from '@radix-ui/themes';

export const loader = (args: LoaderFunctionArgs) =>
  authkitLoader(
    args,
    async () => {
      return { ensureSignedIn: true };
    },
    { debug: true }
  );

type AuthLoaderData = {
  ensureSignedIn: boolean;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
  }; 
  role: string;
};
  
export default function AccountPage() {

  const { user, role } = useLoaderData<AuthLoaderData>();

  const userFields = [
    ['First name', user.firstName],
    ['Last name', user.lastName],
    ['Email', user.email],
    ['Id', user.id],
    role ? ['Role', role] : [],
  ].filter((arr) => arr.length > 0);

  return (
    <>
      <Flex direction="column" gap="2" mb="7">
        <Heading size="8" align="center">
          Account details
        </Heading>
        <Text size="5" align="center" color="gray">
          Below are your account details
        </Text>
      </Flex>

      {userFields && (
        <Flex direction="column" justify="center" gap="3" width="400px">
          {userFields.map(([label, value]) => (
            <Flex asChild align="center" gap="6" key={value}>
              <label>
                <Text weight="bold" size="3" style={{ width: 100 }}>
                  {label}
                </Text>

                <Box flexGrow="1">
                  <TextField.Root value={value || ''} readOnly />
                </Box>
              </label>
            </Flex>
          ))}
        </Flex>
      )}
    </>
  );
}
