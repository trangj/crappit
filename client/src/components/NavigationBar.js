import React, { useContext, useEffect } from "react";
import Login from "../components/User/Login";
import Register from "../components/User/Register";
import AddTopic from "../components/AddTopic";
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
import { GlobalContext } from "../context/GlobalState";
import {
	HamburgerIcon,
	MoonIcon,
	SunIcon,
	TriangleDownIcon,
} from "@chakra-ui/icons";

const NavigationBar = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const { fetchUser, logoutUser, user } = useContext(GlobalContext);

	useEffect(() => {
		if (localStorage.token) {
			fetchUser();
		}
		// eslint-disable-next-line
	}, []);

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
							<MenuDivider />
							{user === undefined ? (
								<MenuItem>Sign up to follow topics!</MenuItem>
							) : (
								<MenuGroup title="Followed Topics">
									<AddTopic />
									{user.followedTopics.map((topic) => (
										<MenuItem as={Link} to={`/t/${topic}`}>
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
							<Login />
							<Register />
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
