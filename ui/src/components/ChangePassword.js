import React, { useState, useRef } from "react";
import Input from "./Input";
import Info from "./Info";
import useFetch from "../hooks/useFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faArrowRight, faCog } from "@fortawesome/free-solid-svg-icons";

const ChangePassword = (props) => {
	const { status, myFetch, clearError } = useFetch();
	const [info, setInfo] = useState("");
	const oldPasswordRef = useRef();
	const passwordRef = useRef();
	const confirmPasswordRef = useRef();

	function handleSubmit(e) {
		e.preventDefault();
		setInfo("");
		const url = props.resetPassword
			? "/reset-change-password"
			: "/change-password";
		const body = props.resetPassword
			? {
					"confirm-password": confirmPasswordRef.current,
					password: passwordRef.current
			  }
			: {
					"old-password": oldPasswordRef.current,
					"confirm-password": confirmPasswordRef.current,
					password: passwordRef.current
			  };
		myFetch(url, body, "POST")
			.then(() => {
				if (props.resetPassword) {
					setInfo(
						"Password reset successful, taking you to login page..."
					);
					setTimeout(props.onSuccessfulPasswordReset, 1000);
				} else {
					setInfo("Password change was successful...");
				}
			})
			.catch(() => {});
	}
	return (
		<div className="ChangePassword">
			{info && <Info info={info} clearInfo={() => setInfo("")} />}
			{status.error && (
				<Info error info={status.error} clearInfo={clearError} />
			)}
			<h3>Change Password</h3>
			<form onSubmit={handleSubmit}>
				{!props.resetPassword && (
					<Input
						type="password"
						name="old-password"
						placeholder="Old Password"
						icon={faLock}
						setRef={(val) => (oldPasswordRef.current = val)}
					/>
				)}
				<Input
					type="password"
					name="password"
					placeholder="New Password"
					icon={faLock}
					setRef={(val) => (passwordRef.current = val)}
				/>
				<Input
					type="password"
					name="confirm-password"
					placeholder="Confirm Password"
					icon={faLock}
					setRef={(val) => (confirmPasswordRef.current = val)}
				/>
				<Input loading={status.loading} icon={faCog} type="submit">
					Change Password
				</Input>
			</form>
			{!props.resetPassword && (
				<p
					className="ChangePassword__go--back"
					onClick={() => props.switchPage(4)}
				>
					Back to Dashboard
					<FontAwesomeIcon icon={faArrowRight} />
				</p>
			)}
		</div>
	);
};

export default ChangePassword;
