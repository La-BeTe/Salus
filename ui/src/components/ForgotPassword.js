import React, { useState, useRef } from "react";
import Input from "./Input";
import Info from "./Info";
import useFetch from "../hooks/useFetch";
import { faEnvelopeOpen, faCog } from "@fortawesome/free-solid-svg-icons";

const ForgotPassword = ({ switchPage }) => {
	const emailRef = useRef();
	const [info, setInfo] = useState("");
	const { status, myFetch, clearError } = useFetch();

	function handleSubmit(e) {
		e.preventDefault();
		setInfo("");
		myFetch("/reset-password", { email: emailRef.current }, "POST")
			.then(() => {
				setInfo("A reset link has been sent to your email");
			})
			.catch(() => {});
	}
	return (
		<div className="ForgotPassword">
			{status.error && (
				<Info error info={status.error} clearInfo={clearError} />
			)}
			{info && <Info info={info} clearInfo={() => setInfo("")} />}
			<h3>Can't remember your password?</h3>
			<p>Enter your email and we'll reset your password</p>
			<form onSubmit={handleSubmit}>
				<Input
					type="email"
					name="email"
					placeholder="Email"
					icon={faEnvelopeOpen}
					setRef={(val) => (emailRef.current = val)}
				/>
				<Input type="submit" icon={faCog} loading={status.loading}>
					Reset Password
				</Input>
			</form>
			<p className="ForgotPassword__sign--up">
				Don't have an account?{" "}
				<span onClick={() => switchPage(0)}>Sign up</span>
			</p>
			<p className="ForgotPassword__log--in">
				Already registered?{" "}
				<span onClick={() => switchPage(1)}>Log in</span>
			</p>
		</div>
	);
};

export default ForgotPassword;
