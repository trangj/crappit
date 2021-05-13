import React, { useEffect, useState } from "react";
import SkeletonCard from "../Utils/SkeletonCard";
import { Link } from "react-router-dom";
import moment from "moment";
import axiosConfig from "../../axiosConfig";
import { Heading, Box, Text } from "@chakra-ui/react";

const Profile = ({ match }) => {
	const [profile, setProfile] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProfile = async (id) => {
			const res = await axiosConfig.get(`/api/user/u/${id}`);
			setProfile(res.data);
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
