import React, { useState, useEffect } from "react";
import SwipeableViews from "react-swipeable-views";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import ChangePassword from "./ChangePassword";
import Dashboard from "./Dashboard";
import Info from "./Info";

const App = () => {
	const [index, setIndex] = useState(1);
	const [user, setUser] = useState(JSON.parse(window.USER));

	useEffect(() => {
		switchPage(user.name ? 4 : 1);
	}, [user]);
	function switchPage(index = 1) {
		// This function handles routing
		switch (index) {
			case 0:
			case 1:
			case 2:
				// If not logged in, switch page
				// Else if logged in, switch to Dashboard
				!user.name ? setIndex(index) : setIndex(4);
				break;
			case 3:
			case 4:
				// If logged in, switch page
				// Else if not logged in, switch to Login page
				user.name ? setIndex(index) : setIndex(1);
				break;
			default:
				setIndex(1);
		}
	}

	function onSuccessfulPasswordReset() {
		setUser({ ...user, resetPassword: false });
		history.pushState({}, "", "/");
	}

	return (
		<div className="App">
			{window.ERROR && <Info error info={window.ERROR} />}
			{user.resetPassword ? (
				<ChangePassword
					resetPassword
					onSuccessfulPasswordReset={onSuccessfulPasswordReset}
				/>
			) : (
				<SwipeableViews disabled index={index}>
					<Signup switchPage={switchPage} />
					<Login setUser={setUser} switchPage={switchPage} />
					<ForgotPassword switchPage={switchPage} />
					{/* Separate both privileged pages because react-swipeable-views
				wraps each child in a div, neeed to keep consistency with
				index above */}
					{user.name ? (
						<ChangePassword switchPage={switchPage} />
					) : (
						<></>
					)}
					{user.name ? (
						<Dashboard
							user={user}
							setUser={setUser}
							switchPage={switchPage}
						/>
					) : (
						<></>
					)}
				</SwipeableViews>
			)}
		</div>
	);
};

export default App;
