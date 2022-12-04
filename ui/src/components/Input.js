import React, { useState, useRef } from "react";
import useValidator from "../hooks/useValidator";
import { FontAwesomeIcon as FontAwesome } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// propsFromParent is the original props from parent containing props
// that should not be passed to the DOM
// But props which is derived from propsFromParent is passed directly to the DOM
// so unallowed DOM attributes are removed from props but not propsFromParent
const Input = (propsFromParent) => {
	const {
		error: validationError,
		setInput: setValidatorInput
	} = useValidator(propsFromParent);
	const props = { ...propsFromParent };
	const [showPassword, setShowPassword] = useState(false);
	const [input, setInput] = useState("");
	const isPassword = useRef(props.type === "password");

	// Deleting props that are not needed in the DOM
	delete props.icon;
	delete props.setRef;

	// Change props.type if initially a password so as to create
	// the ability to switch inputs with type=password from text to password
	props.type =
		isPassword.current && showPassword
			? "text"
			: !isPassword.current
			? props.type
			: "password";

	function changeShowPassword() {
		setShowPassword(!showPassword);
	}
	function handleInputChange(e) {
		if (propsFromParent.setRef) propsFromParent.setRef(e.target.value);
		setValidatorInput(e.target.value);
		setInput(e.target.value);
	}

	if (props.type === "submit") {
		return (
			<button type="submit">
				{props.loading ? (
					<FontAwesome icon={propsFromParent.icon} spin size="2x" />
				) : (
					<>{props.children}</>
				)}
			</button>
		);
	}

	return (
		<div className="Input">
			{!!propsFromParent.icon && (
				<FontAwesome icon={propsFromParent.icon} />
			)}
			<input value={input} onChange={handleInputChange} {...props} />
			{isPassword.current && (
				<FontAwesome
					onClick={changeShowPassword}
					icon={showPassword ? faEyeSlash : faEye}
					onPointerDown={(e) => e.preventDefault()}
				/>
			)}
			{validationError && (
				<span className="validationError">{validationError}</span>
			)}
		</div>
	);
};

export default Input;
