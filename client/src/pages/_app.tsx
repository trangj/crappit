import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import App, { AppProps, AppContext } from 'next/app';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import NavigationBar from 'src/components/navbar/NavigationBar';
import { UserProvider } from 'src/context/UserState';
import '../styles/globals.css';
import { User } from 'src/types/entities/user';
import { Hydrate } from 'react-query/hydration';
import Head from 'next/head';
import CustomToaster from 'src/components/util/CustomToaster';
import axios from '../axiosConfig';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

type MyAppProps = AppProps & {
  user: User;
};

MyApp.getInitialProps = async (ctx: AppContext) => {
  let user = null;
  const props = await App.getInitialProps(ctx);

  try {
    if (typeof window === 'undefined' && ctx.ctx.req?.headers.cookie) {
      axios.defaults.headers.get.Cookie = ctx.ctx.req?.headers.cookie;
      if (!ctx.ctx.req?.url?.startsWith('/_next/data')) {
        const res = await axios.get('/api/user/me');
        user = res.data.user;
      }
    }
  } catch (err: any) {
    if (err.response && err.response.status === 403) {
      ctx.ctx.res?.setHeader(
        'Set-Cookie',
        `crappit_session=; Domain=${process.env.DOMAIN}; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure`,
      );
    }
  }
  return { user, ...props };
};

function MyApp({ Component, pageProps, user }: MyAppProps) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 30000 } } }),
  );

  return (
    <>
      <Head>
        <meta
          property="og:image"
          content={`https://${process.env.NEXT_PUBLIC_DOMAIN_NAME}/img/logo.png`}
          key="default"
        />
      </Head>
      <UserProvider user={user}>
        <QueryClientProvider client={queryClient}>
          <NavigationBar />
          <Hydrate state={pageProps && pageProps.dehydratedState}>
            <Component {...pageProps} />
          </Hydrate>
        </QueryClientProvider>
      </UserProvider>
      <CustomToaster />
    </>
  );
}
export default MyApp;
