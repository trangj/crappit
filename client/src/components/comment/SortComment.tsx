import { Listbox } from '@headlessui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Post } from 'src/types/entities/post';
import { Topic } from 'src/types/entities/topic';

type Props = {
    sortParam: string,
    setSortParam: (arg: string) => void;
    topic: Topic,
    post: Post;
};

const SortComment = ({ sortParam, setSortParam, topic, post }: Props) => {
    const router = useRouter();

    const handleSortChange = (sort: string) => {
        setSortParam(sort);
        router.push(`/t/${topic.title}/comments/${post.id}?sort=${sort}`, undefined, { shallow: true });
    };

    return (
        <Listbox value={sortParam} onChange={handleSortChange} as="div" className="relative">
            <Listbox.Button className="font-medium text-blue-600 dark:text-blue-400 text-xs capitalize" >Sort by: {sortParam === '' ? 'Hot' : sortParam}</Listbox.Button>
            <Listbox.Options className="cursor-pointer z-10 w-16 font-medium absolute left-0 origin-top-right border bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700 rounded flex flex-col">
                <Listbox.Option
                    value="hot"
                    className="p-2 hover:bg-blue-400 hover:bg-opacity-10"
                >
                    {({ selected }) => (
                        <span className={!selected ? 'opacity-50' : ''}>
                            Hot
                        </span>
                    )}
                </Listbox.Option>
                <Listbox.Option
                    value="new"
                    className="p-2 hover:bg-blue-400 hover:bg-opacity-10"
                >
                    {({ selected }) => (
                        <span className={!selected ? 'opacity-50' : ''}>
                            New
                        </span>
                    )}
                </Listbox.Option>
                <Listbox.Option
                    value="top"
                    className="p-2 hover:bg-blue-400 hover:bg-opacity-10"
                >
                    {({ selected }) => (
                        <span className={!selected ? 'opacity-50' : ''}>
                            Top
                        </span>
                    )}
                </Listbox.Option>
            </Listbox.Options>
        </Listbox>
    );
};

export default SortComment;
