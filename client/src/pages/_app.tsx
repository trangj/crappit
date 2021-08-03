import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import App, { AppProps } from "next/app";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import NavigationBar from "src/components/navbar/NavigationBar";
import { UserProvider } from "src/context/UserState";
import '../styles/globals.css';
import axios from '../axiosConfig';
import { User } from "src/types/entities/user";
import { Hydrate } from 'react-query/hydration';
import { ToastBar, Toaster } from "react-hot-toast";
import Head from "next/head";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

type MyAppProps = AppProps & {
    token: string,
    user: User;
};

MyApp.getInitialProps = async (ctx: any) => {
    const props = await App.getInitialProps(ctx);
    let user = null;
    let token = '';
    try {
        if (typeof window === 'undefined' && ctx.ctx.req.cookies.token) {
            const res = await axios.post('/api/user/refresh_token', {}, { headers: { cookie: 'token=' + ctx.ctx.req.cookies.token } });
            axios.defaults.headers.authorization = res.data.access_token;
            user = res.data.user;
            token = res.data.access_token;
        }
    } catch (err) {
        ctx.ctx.res.setHeader('Set-Cookie', `token=; Domain=${process.env.DOMAIN}; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure`);
    }
    return {
        ...props,
        user,
        token
    };
};

function MyApp({ Component, pageProps, token, user }: MyAppProps) {
    axios.defaults.headers.authorization = token;
    const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 10000 } } }));

    return (
        <>
            <Head>
                <meta property="og:image" content="https://crappit.me/img/logo.png" key="default" />
            </Head>
            <UserProvider user={user}>
                <QueryClientProvider client={queryClient}>
                    <NavigationBar />
                    <Hydrate state={pageProps.dehydratedState}>
                        <Component {...pageProps} />
                    </Hydrate>
                </ QueryClientProvider>
            </UserProvider>
            <Toaster position="bottom-center" toastOptions={{ className: "bg-white border-gray-500 dark:bg-gray-850 dark:border-gray-500 dark:text-gray-200 w-full border justify-start", duration: 5000 }}>
                {(t) => (
                    <ToastBar toast={t} style={{ maxWidth: '476px', padding: '0.7rem' }}>
                        {({ icon, message }) => (
                            <>
                                {icon}
                                <div>{message}</div>
                            </>
                        )}
                    </ToastBar>
                )}
            </Toaster>
        </>
    );
}
export default MyApp;

