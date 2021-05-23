import React, { useContext } from "react";
import {
	Box,
	IconButton,
	Spacer,
	Button,
	Heading,
	HStack,
	useColorMode,
	useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserState";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import UserMenu from "./UserMenu";
import BrowseMenu from "./BrowseMenu";

const NavigationBar = () => {
	const { logoutUser, user } = useContext(UserContext);
	const { toggleColorMode } = useColorMode();
	const bg = useColorModeValue("white", "gray.900");
	const icon = useColorModeValue(<MoonIcon />, <SunIcon />);

	return (
		<>
			<Box bg={bg} p={3}>
				<HStack>
					<Heading mr="2">
						<Link to="/">Crappit</Link>
					</Heading>
					<BrowseMenu user={user} />
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
						<UserMenu user={user} logoutUser={logoutUser} />
					)}
				</HStack>
			</Box>
		</>
	);
};

export default NavigationBar;
