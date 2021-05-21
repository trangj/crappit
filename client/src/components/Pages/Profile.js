import React from "react";
import SkeletonCard from "../Utils/SkeletonCard";
import { Link } from "react-router-dom";
import moment from "moment";
import { Heading, Box, Text, Divider } from "@chakra-ui/react";
import useProfile from "../../hooks/user-query/useProfile";
import AlertStatus from "../Utils/AlertStatus";

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
		<Box mb="2" borderWidth="1px" borderRadius="lg" overflow="hidden">
			<Box m="3">
				<Heading>u/{profile.username}</Heading>
				<Text>User since {moment(profile.register_date).fromNow()}</Text>
				<Divider my="3" />
				<Heading fontSize="sm">Followed Topics</Heading>
				{profile.followedTopics.map((topic) => (
					<Text key={topic}>
						<Link to={`/t/${topic}`}>t/{topic}</Link>
					</Text>
				))}
			</Box>
		</Box>
	);
};

export default Profile;
