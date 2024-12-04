import { authLoader } from '~/authkit';
// import { authLoader } from '@workos-inc/authkit-react-router';

// export const loader = authLoader();
export const loader = authLoader({ returnPathname: '/' });