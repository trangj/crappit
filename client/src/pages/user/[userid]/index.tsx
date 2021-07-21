import React from "react";
import useProfile, { fetchProfile } from "../../../hooks/user-query/useProfile";
import { Card, Container } from "../../../ui";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(["profile", query.userid], () => fetchProfile(query.userid as string));
	return {
		props: {
			dehydratedState: dehydrate(queryClient)
		}
	};
};

const Profile = () => {
	const router = useRouter();
	const { userid } = router.query;
	const {
		data: profile,
	} = useProfile(userid as string);

	return (
		<Container>
			<Head>
				<title>u/{profile?.username} - Crappit</title>
				<meta name="description" content={`u/${profile?.username}`} />
				<meta property="og:title" content={`u/${profile?.username} - Crappit`} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content={`https://crappit.me/user${profile?.id}`} />
			</Head>
			<Card className="p-3">
				<h6>u/{profile?.username}</h6>
				<p>User since {dayjs(profile?.created_at).fromNow()}</p>
			</Card>
		</Container>
	);
};

export default Profile;
