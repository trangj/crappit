import React from "react";
import SkeletonCard from "../../../components/utils/SkeletonCard";
import { Heading, Text, Container } from "@chakra-ui/react";
import useProfile from "../../../hooks/user-query/useProfile";
import Card from "../../../components/utils/Card";
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

	if (isLoading || !profile) return <SkeletonCard />;

	return (
		<>
			<Head>
				<title>u/{profile.username} - Crappit</title>
				<meta name="description" content={`u/${profile.username}`} />
				<meta property="og:title" content={`u/${profile.username} - Crappit`} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content={`https://crappit.me/user${profile.id}`} />
				<meta property="twitter:title" content={`u/${profile.username} - Crappit`} />
			</Head>
			<Container>
				<Card>
					<Heading>u/{profile.username}</Heading>
					<Text>User since {dayjs(profile.created_at).fromNow()}</Text>
				</Card>
			</Container>
		</>
	);
};

export default Profile;
