import React, { useState, useRef } from "react";
import useFetch from "../hooks/useFetch";
import Input from "./Input";
import Info from "./Info";
import {
	faEnvelopeOpen,
	faLock,
	faUserAlt,
	faSpinner
} from "@fortawesome/free-solid-svg-icons";

const Signup = ({ switchPage }) => {
	const [info, setInfo] = useState("");
	const inputsRef = useRef({});
	const { status, myFetch, clearError } = useFetch();

	function handleSubmit(e) {
		e.preventDefault();
		setInfo("");
		const { email, name, password, confirmPassword } = inputsRef.current;
		myFetch(
			"/signup",
			{ email, password, name, "confirm-password": confirmPassword },
			"POST"
		)
			.then(() => {
				setInfo("Sign up successful, please log in...");
			})
			.catch(() => {});
	}
	return (
		<div className="Signup">
			{info && <Info info={info} clearInfo={() => setInfo("")} />}
			{status.error && (
				<Info error info={status.error} clearInfo={clearError} />
			)}
			<h3>Hey stranger!!!</h3>
			<form onSubmit={handleSubmit}>
				<Input
					type="text"
					name="name"
					placeholder="Full Name"
					icon={faUserAlt}
					setRef={(val) => (inputsRef.current.name = val)}
				/>
				<Input
					type="email"
					name="email"
					placeholder="Email"
					icon={faEnvelopeOpen}
					setRef={(val) => (inputsRef.current.email = val)}
				/>
				<Input
					icon={faLock}
					type="password"
					name="password"
					placeholder="Password"
					setRef={(val) => (inputsRef.current.password = val)}
				/>
				<Input
					icon={faLock}
					type="password"
					name="confirm-password"
					placeholder="Confirm Password"
					setRef={(val) => (inputsRef.current.confirmPassword = val)}
				/>
				<Input icon={faSpinner} type="submit" loading={status.loading}>
					Sign Up
				</Input>
			</form>
			<p className="Signup__log--in">
				Already registered?{" "}
				<span onClick={() => switchPage(1)}>Log in</span>
			</p>
		</div>
	);
};

export default Signup;
