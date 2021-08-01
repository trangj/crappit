import React from 'react';
import { User } from 'src/types/entities/user';
import Image from 'next/image';
import dayjs from "dayjs";
import { Card } from 'src/ui';

type Props = {
    profile: User;
};

const UserCard = ({ profile }: Props) => {
    return (
        <Card>
            <div className="h-24 bg-blue-400" />
            <div className="-mt-16 ml-3 h-20 w-20 border-4 rounded bg-gray-300 dark:bg-gray-500">
                {profile && profile.avatar_image_name && <Image src={profile.avatar_image_name} alt="user avatar" height={80} width={80} />}
            </div>
            <div className="p-3 gap-3 flex flex-col">
                <small className="font-medium">u/{profile?.username}</small>
                <div className="flex flex-col">
                    <small className="font-medium">Cake Day</small>
                    <small>{dayjs(profile?.created_at).format('MMMM D, YYYY')}</small>
                </div>
            </div>
        </Card>
    );
};

export default UserCard;
