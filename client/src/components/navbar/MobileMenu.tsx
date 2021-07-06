import { Flex, Divider, Box, forwardRef } from '@chakra-ui/react';
import React from 'react';
import { User } from 'src/types/entities/user';
import Link, { LinkProps } from 'next/link';
import useTopicFollow from "../../hooks/topic-query/useTopicFollow";

type Props = {
    user: User;
    logoutUser: () => void;
    showMenu: (arg: boolean) => void;
};

const MobileMenu = ({ user, logoutUser, showMenu }: Props) => {
    const { data, isLoading } = useTopicFollow();

    const MenuItem = forwardRef<LinkProps, 'div'>(({ href, children, ...props }, ref) => (
        <Link href={href} passHref>
            <Box as="a" my="2" display="block" ref={ref} {...props} onClick={() => showMenu(false)}>
                {children}
            </Box>
        </Link>
    ));

    return (
        <Flex flexDirection="column" display={{ sm: 'none' }}>
            <MenuItem href="/">
                Home
            </MenuItem>
            <MenuItem href="/t">
                Discover Topics
            </MenuItem>
            <MenuItem href={`/submit`}>
                Create a post
            </MenuItem>
            <MenuItem href={`/t/submit`}>
                Create a topic
            </MenuItem>
            {!user ? (
                <MenuItem href="/register">
                    Sign up to follow topics!
                </MenuItem>
            ) : (
                !isLoading && data && (data.topics_followed.map((topic, i) => (
                    <MenuItem href={`/t/${topic.title}`} key={i}>
                        t/{topic.title}
                    </MenuItem>
                )))
            )}
            <Divider my="1" />
            {!user ? (
                <>
                    <MenuItem href="/login">
                        Login
                    </MenuItem>
                    <MenuItem href="/register">
                        Register
                    </MenuItem>
                </>
            ) : (
                <>
                    <MenuItem href={`/user/${user.id}`}>
                        {user.username}
                    </MenuItem>
                    <MenuItem href={"/settings"}>
                        Settings
                    </MenuItem>
                    <Box
                        onClick={async () => {
                            await logoutUser();
                        }}
                    >
                        Logout
                    </Box>
                </>
            )}
        </Flex>
    );
};

export default MobileMenu;
