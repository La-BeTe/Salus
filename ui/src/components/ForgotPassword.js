import React, { useState } from "react";
import { faEnvelopeOpen, faCog } from "@fortawesome/free-solid-svg-icons";

import Input from "./Input";
import { validator } from "../utils";
import useFetch from "../hooks/useFetch";

const ForgotPassword = ({ switchPage, setInfo }) => {
	const [ isLoading, _fetch ] = useFetch();
	const [ inputs, setInputs ] = useState({});

	async function handleSubmit(ev) {
		ev.preventDefault();
		setInfo();
		const response = await _fetch("/reset-password", inputs, "POST");
		if(response?.ok){
			setInputs({});
			setInfo("A reset link has been sent to your email.");
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
		<div className="ForgotPassword">
			<h3>Can't remember your password?</h3>
			<p>Enter your email below and we'll reset your password</p>
			<form onSubmit={handleSubmit}>
				<Input
					type="email"
					name="email"
					placeholder="Email"
					input={inputs.email}
					icon={faEnvelopeOpen}
					setRef={updateInputs("email")}
				/>
				<Input type="submit" icon={faCog} loading={isLoading}>
					Reset Password
				</Input>
			</form>
			<p className="ForgotPassword__sign--up">
				Don't have an account?{" "}
				<span onClick={() => switchPage("signup")}>Sign up</span>
			</p>
			<p className="ForgotPassword__log--in">
				Already registered?{" "}
				<span onClick={() => switchPage("login")}>Log in</span>
			</p>
		</div>
	);
};

export default ForgotPassword;
