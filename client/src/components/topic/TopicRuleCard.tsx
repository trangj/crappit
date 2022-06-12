import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import React from 'react';
import { Topic } from 'src/types/entities/topic';
import { Card } from 'src/ui/Card';
import { Divider } from 'src/ui/Divider';

type TopicRuleCardProps = {
  topicData: Topic;
};

function TopicRuleCard({ topicData }: TopicRuleCardProps) {
  return (
    <Card className="p-3 flex flex-col">
      <div className="text-gray-500 dark:text-gray-400 font-bold text-sm mb-3">
        t/
        {topicData.title}
        {' '}
        Rules
      </div>
      {topicData?.rules.map((rule, i) => (
        <Disclosure as="div" key={i}>
          {({ open, close }) => (
            <>
              <Disclosure.Button className="font-medium py-2 w-full flex text-sm">
                <span className="mr-1">
                  {i + 1}
                  .
                </span>
                <span className="mr-1 text-left">{rule.name}</span>
                {open ? (
                  <ChevronUpIcon className="h-4 w-4 mt-0.5 ml-auto flex-none" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 mt-0.5 ml-auto flex-none" />
                )}
              </Disclosure.Button>
              <Disclosure.Panel
                as="div"
                className="content px-4 pb-2 cursor-pointer"
                onClick={() => close()}
              >
                {rule.description}
              </Disclosure.Panel>
              {i !== topicData.rules.length - 1 && <Divider />}
            </>
          )}
        </Disclosure>
      ))}
    </Card>
  );
}

export default TopicRuleCard;
