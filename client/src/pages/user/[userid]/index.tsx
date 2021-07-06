import React from "react";
import SkeletonCard from "../../../components/utils/SkeletonCard";
import { Heading, Text, Container } from "@chakra-ui/react";
import useProfile from "../../../hooks/user-query/useProfile";
import AlertStatus from "../../../components/utils/AlertStatus";
import Card from "../../../components/utils/Card";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import Head from "next/head";

const Profile = () => {
	const router = useRouter();
	const { userid } = router.query;
	const {
		isLoading,
		isError,
		data: profile,
		error,
	} = useProfile(userid as string);

	if (isError) return <AlertStatus status={error} />;
	if (isLoading || !profile) return <SkeletonCard />;

	return (
		<>
			<Head>
				<title>u/{profile.username} - Crappit</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta name="description" content={`u/${profile.username}`} />
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
