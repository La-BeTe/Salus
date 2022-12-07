import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRight,
	faArrowLeft,
	faSpinner
} from "@fortawesome/free-solid-svg-icons";

import useFetch from "../hooks/useFetch";

const Dashboard = ({ switchPage, user, logOutUser, setInfo }) => {
	const [ isLoading, _fetch ] = useFetch();
	const userAuthType = String(user.authType)[0].toUpperCase() + String(user.authType).slice(1);

	async function handleLogout() {
		if(isLoading) return;
		const response = await _fetch("/logout", {}, "GET");
		if(response?.ok) logOutUser();
		else setInfo(response.error, true);
	}

	return (
		<div className="Dashboard">
			<h3>Hey {user.name}</h3>
			<p>You have successfully signed in with your {userAuthType} account.</p>
			<div className="Dashboard__actions">
				{userAuthType === "Email" && (
					<p onClick={() => switchPage("changepassword")}>
						<FontAwesomeIcon icon={faArrowLeft} />
						Change Password
					</p>
				)}
				<p onClick={handleLogout}>
					Sign{isLoading && "ing"} Out
					<FontAwesomeIcon
						icon={isLoading ? faSpinner : faArrowRight}
						spin={isLoading}
					/>
				</p>
			</div>
		</div>
	);
};

export default Dashboard;
