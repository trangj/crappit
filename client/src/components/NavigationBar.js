import React, { useContext } from "react";
import {
	Box,
	IconButton,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Spacer,
	Button,
	Heading,
	HStack,
	useColorMode,
	MenuGroup,
	MenuDivider,
	useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserState";
import {
	HamburgerIcon,
	MoonIcon,
	SunIcon,
	TriangleDownIcon,
} from "@chakra-ui/icons";

const NavigationBar = () => {
	const { logoutUser, user } = useContext(UserContext);
	const { toggleColorMode } = useColorMode();
	const bg = useColorModeValue("gray.200", "gray.700");
	const icon = useColorModeValue(<MoonIcon />, <SunIcon />);

	return (
		<>
			<Box bg={bg} p={3}>
				<HStack>
					<Heading mr="2">
						<Link to="/">Crappit</Link>
					</Heading>
					<Menu>
						<MenuButton as={Button} rightIcon={<TriangleDownIcon />}>
							Browse
						</MenuButton>
						<MenuList>
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
							<MenuDivider />
							{user === undefined ? (
								<MenuItem as={Link} to="/register">
									Sign up to follow topics!
								</MenuItem>
							) : (
								<MenuGroup title="Followed Topics">
									{user.followedTopics.map((topic, i) => (
										<MenuItem as={Link} to={`/t/${topic}`} key={i}>
											t/{topic}
										</MenuItem>
									))}
								</MenuGroup>
							)}
						</MenuList>
					</Menu>
					<Spacer />
					<IconButton icon={icon} onClick={toggleColorMode} />
					{user === undefined ? (
						<>
							<Button as={Link} to="/login">
								Login
							</Button>
							<Button as={Link} to="/register">
								Register
							</Button>
						</>
					) : (
						<>
							<Menu>
								<MenuButton
									as={IconButton}
									icon={<HamburgerIcon />}
								></MenuButton>
								<MenuList>
									<MenuItem as={Link} to={`/user/${user._id}`}>
										Profile
									</MenuItem>
									<MenuItem
										onClick={() => {
											logoutUser();
										}}
										color="inherit"
									>
										Logout
									</MenuItem>
								</MenuList>
							</Menu>
						</>
					)}
				</HStack>
			</Box>
		</>
	);
};

export default NavigationBar;
