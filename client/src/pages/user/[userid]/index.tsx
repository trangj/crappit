import React from "react";
import SkeletonCard from "../../../components/utils/SkeletonCard";
import Link from "next/link";
import { Heading, Text, Divider, Container } from "@chakra-ui/react";
import useProfile from "../../../hooks/user-query/useProfile";
import AlertStatus from "../../../components/utils/AlertStatus";
import Card from "../../../components/utils/Card";
import dayjs from "dayjs";
import { useRouter } from "next/router";

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
		<Container>
			<Card>
				<Heading>u/{profile.username}</Heading>
				<Text>User since {dayjs(profile.created_at).fromNow()}</Text>
				<Divider my="3" />
				<Heading fontSize="sm">Followed Topics</Heading>
				{profile.topics_followed.map((topic) => (
					<Link passHref href={`/t/${topic.title}`} key={topic.title}>
						<a style={{ display: "block" }}>t/{topic.title}</a>
					</Link>
				))}
			</Card>
		</Container>
	);
};

export default Profile;
