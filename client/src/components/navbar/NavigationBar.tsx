import React, { useContext, useState } from "react";
import {
	Box,
	IconButton,
	Spacer,
	Button,
	Heading,
	useColorMode,
	useColorModeValue,
	Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserState";
import { MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";
import UserMenu from "./UserMenu";
import BrowseMenu from "./BrowseMenu";
import MobileMenu from "./MobileMenu";

const NavigationBar = () => {
	const { logoutUser, user } = useContext(UserContext);
	const { toggleColorMode } = useColorMode();
	const bg = useColorModeValue("white", "gray.700");
	const border = useColorModeValue("gray.300", "gray.600");
	const icon = useColorModeValue(<MoonIcon />, <SunIcon />);
	const [menu, showMenu] = useState(false);

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
					<MobileMenu user={user} logoutUser={logoutUser} showMenu={showMenu} />
				)}
			</Flex>
		</Box>
	);
};

export default NavigationBar;
