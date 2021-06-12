import React, { useContext, useState } from "react";
import {
	Box,
	IconButton,
	Spacer,
	Button,
	Heading,
	Divider,
	useColorMode,
	useColorModeValue,
	Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserState";
import { MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";
import UserMenu from "./UserMenu";
import BrowseMenu from "./BrowseMenu";

const NavigationBar = () => {
	const { logoutUser, user } = useContext(UserContext);
	const { toggleColorMode } = useColorMode();
	const bg = useColorModeValue("white", "gray.700");
	const border = useColorModeValue("gray.300", "gray.600");
	const icon = useColorModeValue(<MoonIcon />, <SunIcon />);
	const [menu, showMenu] = useState(false);

	const MenuItem = ({ children, ...props }) => {
		return (
			<Box py="2" {...props} onClick={() => showMenu(false)}>
				{children}
			</Box>
		);
	};

	return (
		<Box
			bg={bg}
			p="2"
			position="fixed"
			width="100%"
			top="0"
			zIndex="4"
			borderBottom="1px"
			borderColor={border}
		>
			<Flex flexDirection="column">
				<Flex alignItems="center" width="100%">
					<Heading px="3" size="lg">
						<Link to="/">Crappit</Link>
					</Heading>
					<BrowseMenu user={user} />
					<Spacer />
					<IconButton
						aria-label="Toggle color mode"
						icon={icon}
						onClick={toggleColorMode}
						mr="2"
					/>
					<Flex display={{ base: "none", sm: "inherit" }}>
						{!user ? (
							<>
								<Button as={Link} to="/login" mr="2">
									Login
								</Button>
								<Button as={Link} to="/register">
									Register
								</Button>
							</>
						) : (
							<UserMenu user={user} logoutUser={logoutUser} />
						)}
					</Flex>
					<IconButton
						aria-label="Toggle menu"
						display={{ base: "inherit", sm: "none" }}
						icon={<HamburgerIcon />}
						onClick={() => showMenu(!menu)}
					/>
				</Flex>
				{menu && (
					<Flex flexDirection="column">
						<MenuItem as={Link} to="/">
							Home
						</MenuItem>
						<MenuItem as={Link} to="/t">
							Discover Topics
						</MenuItem>
						<MenuItem as={Link} to={`/submit`}>
							Create a post
						</MenuItem>
						<MenuItem as={Link} to={`/t/submit`}>
							Create a topic
						</MenuItem>
						{!user ? (
							<MenuItem as={Link} to="/register">
								Sign up to follow topics!
							</MenuItem>
						) : (
							user.topics_followed.map((topic, i) => (
								<MenuItem as={Link} to={`/t/${topic.title}`} key={i}>
									t/{topic.title}
								</MenuItem>
							))
						)}
						<Divider my="1" />
						{!user ? (
							<>
								<MenuItem as={Link} to="/login" mr="2">
									Login
								</MenuItem>
								<MenuItem as={Link} to="/register">
									Register
								</MenuItem>
							</>
						) : (
							<>
								<MenuItem as={Link} to={`/user/${user.id}`}>
									{user.username}
								</MenuItem>
								<MenuItem as={Link} to={"/settings"}>
									Settings
								</MenuItem>
								<MenuItem
									onClick={() => {
										logoutUser();
									}}
									color="inherit"
								>
									Logout
								</MenuItem>
							</>
						)}
					</Flex>
				)}
			</Flex>
		</Box>
	);
};

export default NavigationBar;
