import React, { useState, useEffect } from "react";
import SwipeableViews from "react-swipeable-views";

import Info from "./Info";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import ForgotPassword from "./ForgotPassword";
import ChangePassword from "./ChangePassword";

const viewIndexMap = {
	// Using the string '0' here so it's not counted
	// as falsy in the switchPage function
	signup: "0", 
	login: 1,
	forgotpassword: 2,
	changepassword: 3,
	dashboard: 4
}

const App = () => {
	const [index, setIndex] = useState(1);
	const [user, setUser] = useState(JSON.parse(window.USER));
	const [info, setInfo] = useState({ error: !!window.ERROR, info: window.ERROR });

	useEffect(() => {
		switchPage(localStorage.getItem("LAST_VISITED_VIEW"));
		if(user.resetPassword) history.pushState({}, "", "/");
	}, [user]);

	function handleSuccessfulPasswordReset() {
		setUser({ ...user, resetPassword: false });
	}

	function logOutUser(){
		setUser({});
		window.USER = JSON.stringify({});
	}

	function logInUser(user){
		setUser(user);
	}

	function displayInfo(message = "", isError = false){
		setInfo({
			info: message,
			error: isError,
		})
	}

	function switchPage(pageName){
		const isLoggedIn = !!user.name;
		// This function handles routing
		switch(pageName){
			case "login":
			case "signup":
			case "forgotpassword":
				// If not logged in, switch page
				// Else if logged in, switch to Dashboard
				pageName = isLoggedIn ? "dashboard" : pageName;
				break;
			case "dashboard":
			case "changepassword":
				// If logged in, switch page
				// Else if not logged in, switch to Login page
				pageName = isLoggedIn ? pageName : "login";
				break;
			default:
				pageName = "login";
		}
		if(user.resetPassword){
			pageName = "changepassword";
		}
		const newIndex = Number(viewIndexMap[pageName]);
		localStorage.setItem("LAST_VISITED_VIEW", pageName);
		setIndex(newIndex);
		(newIndex !== index) && displayInfo();
	}

	return (
		<div className="App">
			<Info { ...info } />
			<SwipeableViews disabled index={index}>
				<Signup 
					setInfo={displayInfo} 
					switchPage={switchPage} 
				/>

				<Login 
					setInfo={displayInfo} 
					logInUser={logInUser} 
					switchPage={switchPage} 
				/>

				<ForgotPassword 
					setInfo={displayInfo} 
					switchPage={switchPage}
				/>

				<ChangePassword 
					setInfo={displayInfo} 
					switchPage={switchPage} 
					isResettingPassword={user.resetPassword} 
					handleSuccessfulPasswordReset={handleSuccessfulPasswordReset} 
				/>

				<Dashboard 
					user={user} 
					setInfo={displayInfo} 
					logOutUser={logOutUser} 
					switchPage={switchPage} 
				/>
			</SwipeableViews>
		</div>
	);
};

export default App;
