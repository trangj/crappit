import dayjs from 'dayjs';
import React from 'react';
import { Topic } from 'src/types/entities/topic';
import { Divider } from 'src/ui/Divider';
import { Disclosure } from '@headlessui/react';
import { ArrowsExpandIcon } from '@heroicons/react/outline';
import { Button } from 'src/ui/Button';
import AddRule from './AddRule';
import DeleteRule from './DeleteRule';

type TopicRulesProps = {
  topic: Topic;
};

function TopicRules({ topic }: TopicRulesProps) {
  return (
    <>
      <div>
        <span className="flex items-center">
          <h5>Rules</h5>
          <AddRule topic={topic} />
        </span>
        <p>
          These are rules that visitors must follow to participate. They can be
          used as reasons to report or ban posts, comments, and users.
          Communities can have a maximum of 15 rules.
        </p>
      </div>
      <div>
        {topic.rules.length === 0 ? (
          <div className="h-72 flex justify-center items-center font-bold">
            No rules yet
          </div>
        ) : (
          topic.rules.map((rule, i) => (
            <Disclosure key={i}>
              <Divider className="mt-4" />
              <div className="font-medium pt-4 w-full flex items-center text-sm justify-between">
                <span>
                  {i + 1}
                  .
                  {' '}
                  {rule.name}
                </span>
                <div className="flex gap-2">
                  <DeleteRule topic={topic} rule={rule} />
                  <Disclosure.Button as={Button} variant="ghost" border="rounded" size="sm" icon={<ArrowsExpandIcon className="h-4 w-4" />} />
                </div>
              </div>
              <Disclosure.Panel className="content px-4 pb-4">
                <small className="text-gray-500 dark:text-gray-400">
                  Description
                </small>
                <div>{rule.description}</div>
                <small className="text-gray-500 dark:text-gray-400">
                  Created
                </small>
                <div>{dayjs(rule.created_at).fromNow()}</div>
              </Disclosure.Panel>
            </Disclosure>
          ))
        )}
      </div>
    </>
  );
}

export default TopicRules;
