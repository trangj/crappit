import React from "react";
import { Topic } from "src/types/entities/topic";
import { Divider } from "src/ui/Divider";
import UpdateTopic from "./UpdateTopic";

type TopicSettingsProps = {
	topic: Topic;
};

const TopicSettings = ({ topic }: TopicSettingsProps) => {
	return (
		<>
			<h5>Topic Settings</h5>
			<Divider className="my-1" />
			<UpdateTopic topic={topic} />
		</>
	);
};

export default TopicSettings;
