import React, { useEffect, useContext, useState } from "react";
import SkeletonCard from "../Utils/SkeletonCard";
import { GlobalContext } from "../../context/GlobalState";
import {
  Card,
  ListItem,
  CardContent,
  Typography,
  ListItemText
} from "@material-ui/core";
import { Link } from "react-router-dom";
import moment from "moment";

const Profile = ({ match }) => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useContext(GlobalContext);

  useEffect(() => {
    const fetchProfile = async id => {
      const res = await fetch(`http://localhost:5000/api/user/u/${id}`);
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
      <Card style={{ marginBottom: "1rem" }}>
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            style={{ marginTop: "1rem" }}
          >
            u/{profile.username}
          </Typography>
          <Typography gutterBottom>
            User since {moment(profile.register_date).fromNow()}
          </Typography>
        </CardContent>
      </Card>
      {profile.followedTopics.map(topic => (
        <Card style={{ marginBottom: "1rem" }} key={topic}>
          <ListItem button component={Link} to={`/t/${topic}`}>
            <ListItemText primary={`t/${topic}`} />
          </ListItem>
        </Card>
      ))}
    </>
  );
};

export default Profile;
