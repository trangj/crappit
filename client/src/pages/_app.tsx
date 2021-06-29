import { ChakraProvider } from "@chakra-ui/react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { AppProps } from "next/app";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import NavigationBar from "src/components/navbar/NavigationBar";
import { UserProvider } from "src/context/UserState";
import theme from "../theme";
import '../styles/globals.css';
import axios from '../axiosConfig';
import { User } from "src/types/entities/user";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

type MyAppProps = AppProps & {
    token: string,
    user: User;
};

MyApp.getInitialProps = async (ctx: any) => {
    try {
        if (typeof window === 'undefined') {
            const res = await axios.post('/api/user/refresh_token', {}, { headers: { cookie: 'token=' + ctx.ctx.req.cookies.token } });
            return {
                user: res.data.user || null,
                token: res.data.access_token || ''
            };
        }
        return {};
    } catch (err) {
        console.log(err);
        return {};
    }
};

function MyApp({ Component, pageProps, token, user }: MyAppProps) {
    return (
        <UserProvider user={user} token={token}>
            <QueryClientProvider client={queryClient}>
                <ChakraProvider theme={theme}>
                    <NavigationBar />
                    <div style={{ paddingTop: "57px" }}>
                        <Component {...pageProps} />
                    </div>
                </ChakraProvider>
            </ QueryClientProvider>
        </UserProvider>
    );
}
export default MyApp;

