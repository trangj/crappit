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
	const { colorMode, toggleColorMode } = useColorMode();
	const { logoutUser, user } = useContext(UserContext);
	return (
		<>
			<Box bg={colorMode === "dark" ? "gray.700" : "gray.200"} p={3}>
				<HStack>
					<Heading mx="4">
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
					<IconButton
						icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
						onClick={toggleColorMode}
					/>
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
									<MenuItem as={Link} to={`/u/${user._id}`}>
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
