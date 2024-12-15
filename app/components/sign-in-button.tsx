import { Form, Link } from 'react-router';
import { Button, Flex } from '@radix-ui/themes';
import { useRootLoaderData } from '~/root';

export default function SignInButton({ large = false }: { large?: boolean }) {
  
  const { user, signInUrl } = useRootLoaderData();

  if (user) {
    return (
      <Flex gap="3">
        <Form method="post">
          <Button type="submit" size={large ? '3' : '2'}>
            Sign Out
          </Button>
        </Form>
      </Flex>
    );
  }

  return (
    <Button asChild size={large ? '3' : '2'}>
      <Link to={signInUrl}>Sign In{large && ' with AuthKit'}</Link>
    </Button>
  );
}
