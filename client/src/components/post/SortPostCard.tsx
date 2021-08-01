import { FireIcon, SparklesIcon, ChartBarIcon } from '@heroicons/react/solid';
import router from 'next/router';
import React from 'react';
import { Card, Button } from 'src/ui';

type Props = {
    sortParam: string,
    setSortParam: (arg: string) => void;
    url?: string;
};

const SortPost = ({ sortParam, setSortParam, url = "" }: Props) => {
    return (
        <Card className="flex gap-2 p-3">
            <Button
                onClick={() => {
                    router.push(`${url}?sort=hot`, undefined, { shallow: true });
                    setSortParam("hot");
                }}
                variant="ghost"
                active={sortParam === "hot" || sortParam === ""}
                icon={<FireIcon className="h-6 w-6 mr-1" />}
            >
                Hot
            </Button>
            <Button
                onClick={() => {
                    router.push(`${url}?sort=new`, undefined, { shallow: true });
                    setSortParam("new");
                }}
                variant="ghost"
                active={sortParam === "new"}
                icon={<SparklesIcon className="h-6 w-6 mr-1" />}
            >
                New
            </Button>
            <Button
                onClick={() => {
                    router.push(`${url}?sort=top`, undefined, { shallow: true });
                    setSortParam("top");
                }}
                variant="ghost"
                active={sortParam === "top"}
                icon={<ChartBarIcon className="h-6 w-6 mr-1" />}
            >
                Top
            </Button>
        </Card>
    );
};

export default SortPost;
