import Head from "next/head";
import React from "react";

const NotFound = () => {
  return (
    <>
      <Head>
        <title>crappit: page not found</title>
      </Head>
      <div className="fixed inset-y-1/2 w-full text-center">
        page not found
      </div>
    </>
  );
};

export default NotFound;
