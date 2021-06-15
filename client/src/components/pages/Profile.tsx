import React from "react";
import SkeletonCard from "../utils/SkeletonCard";
import { Link, RouteComponentProps } from "react-router-dom";
import { Heading, Text, Divider, Container } from "@chakra-ui/react";
import useProfile from "../../hooks/user-query/useProfile";
import AlertStatus from "../utils/AlertStatus";
import Card from "../utils/Card";
import dayjs from "dayjs";

interface MatchParams {
	userid: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

const Profile = ({ match }: Props) => {
	const {
		isLoading,
		isError,
		data: profile,
		error,
	} = useProfile(match.params.userid);

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
					<Text key={topic.title}>
						<Link to={`/t/${topic.title}`}>t/{topic.title}</Link>
					</Text>
				))}
			</Card>
		</Container>
	);
};

export default Profile;
