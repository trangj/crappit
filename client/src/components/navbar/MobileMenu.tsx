import { Flex, Divider, Box, forwardRef, BoxProps } from '@chakra-ui/react';
import React from 'react';
import { User } from 'src/types/entities/user';
import { Link } from 'react-router-dom';

type Props = {
    user: User;
    logoutUser: () => void;
    showMenu: (arg: boolean) => void;
};

const MobileMenu = ({ user, logoutUser, showMenu }: Props) => {

    const MenuItem = forwardRef<BoxProps, 'div'>(({ children, ...props }, ref) => (
        <Box as={Link} my="2" display="block" {...props} onClick={() => showMenu(false)}>
            {children}
        </Box>
    ));

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
                    <MenuItem to="/login">
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
