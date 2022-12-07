import React, { useState } from "react";
import {
	faEnvelopeOpen,
	faLock,
	faUserAlt,
	faSpinner
} from "@fortawesome/free-solid-svg-icons";

import Input from "./Input";
import { validator } from "../utils";
import useFetch from "../hooks/useFetch";


const Signup = ({ switchPage, setInfo }) => {
	const [ isLoading, _fetch ] = useFetch();
	const [ inputs, setInputs ] = useState({});

	async function handleSubmit(ev) {
		ev.preventDefault();
		setInfo();
		const response = await _fetch("/signup", inputs, "POST");
		if(response?.ok){
			setInputs({});
			setInfo("Sign up successful, please log in...");
			setTimeout(() => switchPage("login"), 2000);
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
		<div className="Signup">
			<h3>Hey stranger!!!</h3>
			<form onSubmit={handleSubmit}>
				<Input
					type="text"
					name="name"
					icon={faUserAlt}
					input={inputs.name}
					placeholder="Full Name"
					setRef={updateInputs("name")}
				/>
				<Input
					type="email"
					name="email"
					placeholder="Email"
					input={inputs.email}
					icon={faEnvelopeOpen}
					setRef={updateInputs("email")}
				/>
				<Input
					icon={faLock}
					type="password"
					name="password"
					placeholder="Password"
					input={inputs.password}
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
				<Input icon={faSpinner} type="submit" loading={isLoading}>
					Sign Up
				</Input>
			</form>
			<p className="Signup__log--in">
				Already registered?{" "}
				<span onClick={() => switchPage("login")}>Log in</span>
			</p>
		</div>
	);
};

export default Signup;
