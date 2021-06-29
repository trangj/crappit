import React from "react";
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuDivider,
	MenuGroup,
	Button,
} from "@chakra-ui/react";
import Link from "next/link";
import { TriangleDownIcon } from "@chakra-ui/icons";
import { User } from "src/types/entities/user";

type Props = {
	user: User | null;
};

const BrowseMenu = ({ user }: Props) => {
	return (
		<Menu>
			<MenuButton as={Button} display={{ base: "none", sm: "inherit" }}>
				Browse
				<TriangleDownIcon ml="1" />
			</MenuButton>
			<div style={{ zIndex: 2 }}>
				<MenuList>
					<Link passHref href="/">
						<MenuItem as="a">
							Home
						</MenuItem>
					</Link>
					<Link passHref href="/t">
						<MenuItem as="a">
							Discover Topics
						</MenuItem>
					</Link>
					<Link passHref href="/submit">
						<MenuItem as="a">
							Create a post
						</MenuItem>
					</Link>
					<Link passHref href="/t/submit">
						<MenuItem as="a">
							Create a topic
						</MenuItem>
					</Link>
					<MenuDivider />
					{!user ? (
						<Link passHref href="/register">
							<MenuItem as="a" >
								Sign up to follow topics!
							</MenuItem>
						</Link>
					) : (
						<MenuGroup title="Followed Topics">
							{user.topics_followed.map((topic, i) => (
								<Link passHref href={`/t/${topic.title}`} key={i}>
									<MenuItem as="a">
										t/{topic.title}
									</MenuItem>
								</Link>
							))}
						</MenuGroup>
					)}
				</MenuList>
			</div>
		</Menu>
	);
};

export default BrowseMenu;
