import React from "react";
import useFetch from "../hooks/useFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRight,
	faArrowLeft,
	faSpinner
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = ({ switchPage, user, setUser }) => {
	const { status, myFetch } = useFetch();

	function handleLogout() {
		if (status.loading) return;
		myFetch("/logout", {}, "GET")
			.then(() => {
				setUser({});
				window.USER = JSON.stringify({});
			})
			.catch(() => {});
	}
	return (
		<div className="Dashboard">
			<h3>Hey {user.name}</h3>
			<p>You have successfully signed in with {user.authType}</p>
			<div className="Dashboard__actions">
				{user.authType === "email" && (
					<p onClick={() => switchPage(3)}>
						<FontAwesomeIcon icon={faArrowLeft} />
						Change Password
					</p>
				)}
				<p onClick={handleLogout}>
					Sign{status.loading && "ing"} Out
					<FontAwesomeIcon
						icon={status.loading ? faSpinner : faArrowRight}
						spin={status.loading}
					/>
				</p>
			</div>
		</div>
	);
};

export default Dashboard;
