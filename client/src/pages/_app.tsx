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
    try {
        if (typeof window === 'undefined' && ctx.ctx.req.cookies.token) {
            const res = await axios.post('/api/user/refresh_token', {}, { headers: { cookie: 'token=' + ctx.ctx.req.cookies.token } });
            axios.defaults.headers.authorization = res.data.access_token;
            return {
                ...props,
                user: res.data.user || null,
                token: res.data.access_token || ''
            };
        }
        return { ...props };
    } catch (err) {
        ctx.ctx.res.setHeader('Set-Cookie', `token=; Path=/; Max-Age=0; Domain=${process.env.DOMAIN}; Secure; HttpOnly`);
        return { ...props };
    }
};

function MyApp({ Component, pageProps, token, user }: MyAppProps) {
    const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 10000 } } }));

    return (
        <>
            <Head>
                <meta property="og:image" content="https://crappit.me/img/logo.png" key="default" />
            </Head>
            <UserProvider user={user} token={token}>
                <QueryClientProvider client={queryClient}>
                    <NavigationBar />
                    <Hydrate state={pageProps.dehydratedState}>
                        <Component {...pageProps} />
                    </Hydrate>
                </ QueryClientProvider>
            </UserProvider>
            <Toaster position="bottom-center" toastOptions={{ className: "bg-white border-gray-500 dark:bg-gray-850 dark:border-gray-500 dark:text-gray-200 border w-80 justify-start", duration: 5000 }}>
                {(t) => (
                    <ToastBar toast={t}>
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

