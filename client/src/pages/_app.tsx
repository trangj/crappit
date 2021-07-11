import { ChakraProvider } from "@chakra-ui/react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import App, { AppProps } from "next/app";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import NavigationBar from "src/components/navbar/NavigationBar";
import { UserProvider } from "src/context/UserState";
import theme from "../theme";
import '../styles/globals.css';
import axios from '../axiosConfig';
import { User } from "src/types/entities/user";
import { Hydrate } from 'react-query/hydration';
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
        if (typeof window === 'undefined') {
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
        return { ...props };
    }
};

function MyApp({ Component, pageProps, token, user }: MyAppProps) {
    const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 10000 } } }));

    return (
        <>
            <Head>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:site_name" content="crappit" />
                <meta property="twitter:site" content="@crappit" />
                <meta property="twitter:card" content="summary" />
            </Head>
            <UserProvider user={user} token={token}>
                <QueryClientProvider client={queryClient}>
                    <ChakraProvider theme={theme}>
                        <NavigationBar />
                        <div style={{ paddingTop: "57px" }}>
                            <Hydrate state={pageProps.dehydratedState}>
                                <Component {...pageProps} />
                            </Hydrate>
                        </div>
                    </ChakraProvider>
                </ QueryClientProvider>
            </UserProvider>
        </>
    );
}
export default MyApp;

