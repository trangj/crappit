import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import App, { AppProps } from 'next/app';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import NavigationBar from 'src/components/navbar/NavigationBar';
import { UserProvider } from 'src/context/UserState';
import '../styles/globals.css';
import { User } from 'src/types/entities/user';
import { Hydrate } from 'react-query/hydration';
import { ToastBar, Toaster } from 'react-hot-toast';
import Head from 'next/head';
import axios from '../axiosConfig';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

type MyAppProps = AppProps & {
  user: User;
};

MyApp.getInitialProps = async (ctx: any) => {
  let user = null;
  const props = await App.getInitialProps(ctx);

  try {
    if (
      typeof window === 'undefined'
      && ctx.ctx.req.cookies.crappit_session
    ) {
      axios.defaults.headers.get.Cookie = `crappit_session=${ctx.ctx.req.cookies.crappit_session}`;
      if (!ctx.ctx.req?.url?.startsWith('/_next/data')) {
        const res = await axios.get('/api/user/me');
        user = res.data.user;
      }
    }
  } catch (err: any) {
    if (err.response && err.response.status === 403) {
      ctx.ctx.res.setHeader(
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
      <Toaster
        position="bottom-center"
        toastOptions={{
          className:
            'bg-white border-gray-500 dark:bg-gray-850 dark:border-gray-500 dark:text-gray-200 w-full border justify-start',
          duration: 5000,
        }}
      >
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
