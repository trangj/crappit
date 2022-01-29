import dayjs from "dayjs";
import React from "react";
import { Topic } from "src/types/entities/topic";
import { Divider } from "src/ui/Divider";
import AddRule from "./AddRule";
import DeleteRule from "./DeleteRule";

type TopicRulesProps = {
	topic: Topic;
};

const TopicRules = ({ topic }: TopicRulesProps) => {
	return (
		<>
			<span className="flex items-center">
				<h5>Rules</h5>
				<AddRule topic={topic} />
			</span>
			<div>
				{topic.rules.length === 0 ? (
					<div className="h-72 flex justify-center items-center font-bold">
						No rules yet
					</div>
				) : (
					topic.rules.map((rule, i) => (
						<div key={i}>
							<Divider />
							<div className="font-medium pt-2 w-full flex items-center text-sm justify-between">
								<span>
									{i + 1}. {rule.name}
								</span>
								<DeleteRule topic={topic} rule={rule} />
							</div>
							<div className="content px-4 pb-2">
								<small className="text-gray-500 dark:text-gray-400">
									Description
								</small>
								<div>{rule.description}</div>
								<small className="text-gray-500 dark:text-gray-400">
									Created
								</small>
								<div>{dayjs(rule.created_at).fromNow()}</div>
							</div>
						</div>
					))
				)}
			</div>
		</>
	);
};

export default TopicRules;
