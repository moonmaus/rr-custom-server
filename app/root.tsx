import {
  Form,
  isRouteErrorResponse,
  Links,
  Link,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteLoaderData } from 'react-router';

import type { 
  ActionFunctionArgs, 
  LinksFunction, 
  LoaderFunctionArgs } from 'react-router';
  
import type { Route } from './+types/root';

import {
  getSignInUrl,
  signOut,
  authkitLoader } from '~/authkit';

import Footer from '~/components/footer';
import stylesheet from "./app.css?url";
import themes from '@radix-ui/themes/styles.css?url';
import { Theme, Card, Container, Flex, Button, Box } from '@radix-ui/themes';

export const links: Route.LinksFunction = () => [
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

export const loader = (args: LoaderFunctionArgs) =>
  authkitLoader(
    args,
    async () => {
      const signInUrl = await getSignInUrl();
      return { signInUrl };
    },
    { debug: true }
  );


export function useRootLoaderData() {
  return useRouteLoaderData<typeof loader>('root');
}

export async function action({ request }: ActionFunctionArgs) {
  return await signOut(request);
}

function SignInButton({ large = false }: { large?: boolean }) {
  
  const rootLoaderData = useRootLoaderData();
  const { user, signInUrl } = rootLoaderData || {};

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

  if (!signInUrl) {
    return <span>Loading...</span>;
  }

  return (
    <Button asChild size={large ? '3' : '2'}>
      <Link to={signInUrl}>Sign In{large && ' with AuthKit'}</Link>
    </Button>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Theme
          accentColor="iris"
          panelBackground="solid"
          style={{ backgroundColor: 'var(--gray-1)' }}
        >
          <Container style={{ backgroundColor: 'var(--gray-1)' }}>
            <Flex direction="column" gap="5" p="5" height="100vh">
              <Box asChild flexGrow="1">
                <Card size="4">
                  <Flex direction="column" height="100%">
                    <Flex asChild justify="between">
                      <header>
                        <Flex gap="4">
                          <Button asChild variant="soft">
                            <Link to="/">Home</Link>
                          </Button>
                        </Flex>

                        <SignInButton />
                      </header>
                    </Flex>

                    <Flex flexGrow="1" align="center" justify="center">
                      <main>
                        {children}
                      </main>
                    </Flex>
                  </Flex>
                </Card>
              </Box>
              <Footer />
            </Flex>
          </Container>
        </Theme>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
