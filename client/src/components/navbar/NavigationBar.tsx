import React, { useState } from "react";
import Link from "next/link";
import { useUser } from "../../context/UserState";
import UserMenu from "./UserMenu";
import BrowseMenu from "./BrowseMenu";
import MobileMenu from "./MobileMenu";
import { Button } from "src/ui/Button";
import { MenuIcon } from '@heroicons/react/outline';
import { useTheme } from "src/hooks/useTheme";

const NavigationBar = () => {
	const { logoutUser, user } = useUser();
	const { theme, setTheme } = useTheme();
	const [menu, showMenu] = useState(false);

	return (
		<div className=" bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700 p-1 fixed w-full top-0 z-10 border-b">
			<div className="flex flex-col">
				<div className="flex items-center w-full">
					<Link passHref href="/">
						<a className="flex items-center gap-2 mx-4">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-8 h-8"><g><circle fill="#FF4500" cx="10" cy="10" r="10"></circle><path fill="#FFF" d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.85-1.23L11,4.65,13.14,5.1a1,1,0,1,0,.13-0.61L10.82,4a0.31,0.31,0,0,0-.37.24L9.71,7.71a7.14,7.14,0,0,0-3.9,1.23A1.46,1.46,0,1,0,4.2,11.33a2.87,2.87,0,0,0,0,.44c0,2.24,2.61,4.06,5.83,4.06s5.83-1.82,5.83-4.06a2.87,2.87,0,0,0,0-.44A1.46,1.46,0,0,0,16.67,10Zm-10,1a1,1,0,1,1,1,1A1,1,0,0,1,6.67,11Zm5.81,2.75a3.84,3.84,0,0,1-2.47.77,3.84,3.84,0,0,1-2.47-.77,0.27,0.27,0,0,1,.38-0.38A3.27,3.27,0,0,0,10,14a3.28,3.28,0,0,0,2.09-.61A0.27,0.27,0,1,1,12.48,13.79Zm-0.18-1.71a1,1,0,1,1,1-1A1,1,0,0,1,12.29,12.08Z"></path></g></svg>
							<div className="font-medium text-xl">
								crappit
							</div>
						</a>
					</Link>
					<BrowseMenu user={user} />
					<div className="w-full"></div>
					<div className="hidden sm:flex gap-2">
						{!user ? (
							<>
								<Link passHref href="/login">
									<Button className="w-32" as="a">
										Login
									</Button>
								</Link>
								<Link passHref href="/register">
									<Button className="w-32" variant="filled" as="a">
										Register
									</Button>
								</Link>
							</>
						) : (
							<UserMenu user={user} logoutUser={logoutUser} theme={theme} setTheme={setTheme} />
						)}
					</div>
					<Button
						className="block sm:hidden"
						onClick={() => showMenu(!menu)}
						variant="ghost"
						border="rounded"
						icon={<MenuIcon className="w-8 h-8" />}
						active={menu}
					/>
				</div>
				{menu && (
					<MobileMenu user={user} logoutUser={logoutUser} showMenu={showMenu} theme={theme} setTheme={setTheme} />
				)}
			</div>
		</div>
	);
};

export default NavigationBar;
