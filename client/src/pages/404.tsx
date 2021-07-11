import Head from "next/head";
import React from "react";

const NotFound = () => {
  return (
    <>
      <Head>
        <title>crappit: page not found</title>
      </Head>
      <div style={{ top: '50%', position: 'fixed', width: '100%', textAlign: 'center' }}>
        page not found
      </div>
    </>
  );
};

export default NotFound;
