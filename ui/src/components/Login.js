import React, { useState } from "react";
import { faEnvelope, faLock, faCog } from "@fortawesome/free-solid-svg-icons";

import Input from "./Input";
import { validator } from "../utils";
import useFetch from "../hooks/useFetch";
import GoogleLogo from "../svg/google.svg";
import TwitterLogo from "../svg/twitter.svg";
import FacebookLogo from "../svg/facebook.svg";

const Login = ({ switchPage, logInUser, setInfo }) => {
	const [ isLoading, _fetch ] = useFetch();
	const [ inputs, setInputs ] = useState({});

	async function handleSubmit(ev){
		ev.preventDefault();
		setInfo();
		const response = await _fetch("/login", inputs, "POST");
		if(response?.ok){
			setInputs({});
			logInUser(response.user);
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
		<div className="Login">
			<h3>Log In</h3>
			<div className="Login__social--icons">
				<div>
					<a href="/auth/google">
						<img src={GoogleLogo} />
						{/* Google */}
					</a>
				</div>
				<div>
					<a href="/auth/facebook">
						<img src={FacebookLogo} />
						{/* Facebook */}
					</a>
				</div>
				<div>
					<a href="/auth/twitter">
						<img src={TwitterLogo} />
						{/* Twitter */}
					</a>
				</div>
			</div>
			<p className="Login__separator">or log in with email</p>
			<form onSubmit={handleSubmit}>
				<Input
					type="email"
					name="email"
					icon={faEnvelope}
					placeholder="Email"
					input={inputs.email}
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
				<label className="Login__remember--me">
					<input 
						type="checkbox" 
						onChange={(ev) => updateInputs("remember-me")(ev.target.checked)} 
					/> Keep me logged in
				</label>
				<Input loading={isLoading} icon={faCog} type="submit">
					Log In
				</Input>
				<p
					className="Login__forgot--password"
					onClick={() => switchPage("forgotpassword")}
				>
					Forgot password?
				</p>
			</form>
			<p className="Login__sign--up">
				Don't have an account?{" "}
				<span onClick={() => switchPage("signup")}>Sign up</span>
			</p>
		</div>
	);
};

export default Login;
