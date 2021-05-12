import React, { useEffect, useState } from "react";
import SkeletonCard from "../Utils/SkeletonCard";
import { Link } from "react-router-dom";
import moment from "moment";
import { Heading, Box, Text } from "@chakra-ui/react";

const baseURL = process.env.SERVER_URL;

const Profile = ({ match }) => {
	const [profile, setProfile] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProfile = async (id) => {
			const res = await fetch(`${baseURL}/api/user/u/${id}`);
			const data = await res.json();
			setProfile(data);
			setLoading(false);
		};
		fetchProfile(match.params.userid);
	}, [match.params.userid]);

	return loading ? (
		<SkeletonCard />
	) : (
		<>
			<Box style={{ marginBottom: "1rem" }}>
				<Box>
					<Heading
						gutterBottom
						variant="h5"
						component="h2"
						style={{ marginTop: "1rem" }}
					>
						u/{profile.username}
					</Heading>
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
