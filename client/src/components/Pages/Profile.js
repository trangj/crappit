import React from "react";
import SkeletonCard from "../Utils/SkeletonCard";
import { Link } from "react-router-dom";
import moment from "moment";
import { Heading, Text, Divider, Container } from "@chakra-ui/react";
import useProfile from "../../hooks/user-query/useProfile";
import AlertStatus from "../Utils/AlertStatus";
import Card from "../Utils/Card";

const Profile = ({ match }) => {
	const {
		isLoading,
		isError,
		data: profile,
		error,
	} = useProfile(match.params.userid);

	if (isLoading) return <SkeletonCard />;
	if (isError) return <AlertStatus status={error} />;

	return (
		<Container>
			<Card>
				<Heading>u/{profile.username}</Heading>
				<Text>User since {moment(profile.created_at).fromNow()}</Text>
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
