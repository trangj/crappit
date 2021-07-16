import React from "react";
import useProfile from "../../../hooks/user-query/useProfile";
import { Card } from "../../../ui";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import Head from "next/head";

const Profile = () => {
	const router = useRouter();
	const { userid } = router.query;
	const {
		isLoading,
		data: profile,
	} = useProfile(userid as string);

	if (isLoading || !profile) return <div>Loading...</div>;

	return (
		<div className="mt-16 container mx-auto max-w-5xl">
			<Head>
				<title>u/{profile.username} - Crappit</title>
				<meta name="description" content={`u/${profile.username}`} />
				<meta property="og:title" content={`u/${profile.username} - Crappit`} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content={`https://crappit.me/user${profile.id}`} />
				<meta property="twitter:title" content={`u/${profile.username} - Crappit`} />
			</Head>
			<Card className="p-3">
				<h6>u/{profile.username}</h6>
				<p>User since {dayjs(profile.created_at).fromNow()}</p>
			</Card>
		</div>
	);
};

export default Profile;
