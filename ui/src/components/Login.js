import React, { useRef } from "react";
import useFetch from "../hooks/useFetch";
import Input from "./Input";
import Info from "./Info";
import { faEnvelope, faLock, faCog } from "@fortawesome/free-solid-svg-icons";
import GoogleLogo from "../svg/google.svg";
import FacebookLogo from "../svg/facebook.svg";
import TwitterLogo from "../svg/twitter.svg";

const Login = ({ switchPage, setUser }) => {
	const emailInputRef = useRef();
	const passwordInputRef = useRef();
	const rememberMeRef = useRef();
	const { status, myFetch, clearError } = useFetch();

	function handleSubmit(e) {
		e.preventDefault();
		myFetch(
			"/login",
			{
				email: emailInputRef.current,
				password: passwordInputRef.current,
				"remember-me": rememberMeRef.current.checked
			},
			"POST"
		)
			.then((result) => {
				setUser(result.user);
			})
			.catch(() => {});
	}
	return (
		<div className="Login">
			{status.error && (
				<Info error info={status.error} clearInfo={clearError} />
			)}
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
					placeholder="Email"
					icon={faEnvelope}
					setRef={(val) => (emailInputRef.current = val)}
				/>
				<Input
					icon={faLock}
					type="password"
					name="password"
					placeholder="Password"
					setRef={(val) => (passwordInputRef.current = val)}
				/>
				<label className="Login__remember--me">
					<input type="checkbox" ref={rememberMeRef} /> Keep me logged
					in
				</label>
				<Input loading={status.loading} icon={faCog} type="submit">
					Log In
				</Input>
				<p
					className="Login__forgot--password"
					onClick={() => switchPage(2)}
				>
					Forgot password?
				</p>
			</form>
			<p className="Login__sign--up">
				Don't have an account?{" "}
				<span onClick={() => switchPage(0)}>Sign up</span>
			</p>
		</div>
	);
};

export default Login;
