import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faArrowRight, faCog } from "@fortawesome/free-solid-svg-icons";

import Input from "./Input";
import { validator } from "../utils";
import useFetch from "../hooks/useFetch";

const ChangePassword = ({ 
	setInfo,
	switchPage, 
	isResettingPassword, 
	handleSuccessfulPasswordReset, 
}) => {
	const [ isLoading, _fetch ] = useFetch();
	const [ inputs, setInputs ] = useState({});

	async function handleSubmit(ev) {
		ev.preventDefault();
		setInfo();
		const url = `/${isResettingPassword ? "reset-" : ""}change-password`;
		const response = await _fetch(url, inputs, "POST");
		if(response?.ok){
			setInputs({});
			if(isResettingPassword){
				setInfo("Password reset successful, taking you to login page...");
				setTimeout(handleSuccessfulPasswordReset, 1000);
			}else setInfo("Password change successful...");
		}else setInfo(response.error, true);
	}

	function updateInputs(name){
		return async function(value){
			setInputs({
				...inputs,
				[name]: {
					value,
					error: await validator(name, value, inputs)
				}
			})
		}
	}

	return (
		<div className="ChangePassword">
			<h3>Change Password</h3>
			<form onSubmit={handleSubmit}>
				{!isResettingPassword && (
					<Input
						icon={faLock}
						type="password"
						name="old-password"
						placeholder="Old Password"
						input={inputs["old-password"]}
						setRef={updateInputs("old-password")}
					/>
				)}
				<Input
					icon={faLock}
					type="password"
					name="password"
					input={inputs.password}
					placeholder="New Password"
					setRef={updateInputs("password")}
				/>
				<Input
					icon={faLock}
					type="password"
					name="confirm-password"
					placeholder="Confirm Password"
					input={inputs["confirm-password"]}
					setRef={updateInputs("confirm-password")}
				/>
				<Input loading={isLoading} icon={faCog} type="submit">
					Change Password
				</Input>
			</form>
			{!isResettingPassword && (
				<p
					className="ChangePassword__go--back"
					onClick={() => switchPage("dashboard")}
				>
					Back to Dashboard
					<FontAwesomeIcon icon={faArrowRight} />
				</p>
			)}
		</div>
	);
};

export default ChangePassword;
