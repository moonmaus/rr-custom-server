import { HandleAuthOptions } from './interfaces.js';
import { LoaderFunctionArgs } from 'react-router';
export declare function authLoader(options?: HandleAuthOptions): ({ request }: LoaderFunctionArgs) => Promise<Response | import("react-router").UNSAFE_DataWithResponseInit<{
    error: {
        message: string;
        description: string;
    };
}> | undefined>;
