import { Flex, Divider, Box, ChakraProps, Link } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { LinkProps } from 'react-router-dom';
import { User } from 'src/types/entities/user';

type Props = {
    user: User;
    logoutUser: () => void;
    showMenu: (arg: boolean) => void;
};

type MenuProps = LinkProps & ChakraProps & {
    children?: ReactNode;
};

const MobileMenu = ({ user, logoutUser, showMenu }: Props) => {

    const MenuItem = ({ children, ...props }: MenuProps) => {
        return (
            <Box py="2">
                <Link {...props} onClick={() => showMenu(false)}>
                    {children}
                </Link>
            </Box>
        );
    };

    return (
        <Flex flexDirection="column" display={{ sm: 'none' }}>
            <MenuItem to="/">
                Home
            </MenuItem>
            <MenuItem to="/t">
                Discover Topics
            </MenuItem>
            <MenuItem to={`/submit`}>
                Create a post
            </MenuItem>
            <MenuItem to={`/t/submit`}>
                Create a topic
            </MenuItem>
            {!user ? (
                <MenuItem to="/register">
                    Sign up to follow topics!
                </MenuItem>
            ) : (
                user.topics_followed.map((topic, i) => (
                    <MenuItem to={`/t/${topic.title}`} key={i}>
                        t/{topic.title}
                    </MenuItem>
                ))
            )}
            <Divider my="1" />
            {!user ? (
                <>
                    <MenuItem to="/login" mr="2">
                        Login
                    </MenuItem>
                    <MenuItem to="/register">
                        Register
                    </MenuItem>
                </>
            ) : (
                <>
                    <MenuItem to={`/user/${user.id}`}>
                        {user.username}
                    </MenuItem>
                    <MenuItem to={"/settings"}>
                        Settings
                    </MenuItem>
                    <Box
                        onClick={() => {
                            logoutUser();
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
