import React from "react";
import SkeletonCard from "../Utils/SkeletonCard";
import { Link } from "react-router-dom";
import moment from "moment";
import { Heading, Box, Text } from "@chakra-ui/react";
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
		<>
			<Box style={{ marginBottom: "1rem" }}>
				<Box>
					<Heading>u/{profile.username}</Heading>
					<Text>User since {moment(profile.register_date).fromNow()}</Text>
				</Box>
			</Box>
			{profile.followedTopics.map((topic) => (
				<Text style={{ marginBottom: "1rem" }} key={topic}>
					<Link to={`/t/${topic}`}>t/{topic}</Link>
				</Text>
			))}
		</>
	);
};

export default Profile;
