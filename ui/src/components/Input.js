import React, { useState } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FontAwesome } from "@fortawesome/react-fontawesome";

// propsFromParent is the original props from parent containing props
// that should not be passed to the DOM
// But props which is derived from propsFromParent is passed directly to the DOM
// so unallowed DOM attributes are removed from props but not propsFromParent
const Input = (propsFromParent) => {
	const [showPassword, setShowPassword] = useState(false);

	const isPasswordInput = propsFromParent.type === "password";
	const props = { 
		...propsFromParent, 
		value: (propsFromParent.input?.value || ""),
		// Change props.type if initially a password so as to create
		// the ability to switch inputs with type=password from text to password
		type: (isPasswordInput && showPassword) ? "text" : propsFromParent.type,
	};

	// Deleting props that are not needed in the DOM
	delete props.icon;
	delete props.input;
	delete props.setRef;

	async function handleInputChange(ev){
		propsFromParent.setRef && propsFromParent.setRef(ev.target.value);
	}

	if(props.type === "submit"){
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
			<input 
				{...props} 
				onChange={handleInputChange} 
			/>
			{isPasswordInput && (
				<FontAwesome
				icon={showPassword ? faEyeSlash : faEye}
				onClick={() => setShowPassword(!showPassword)}
					onPointerDown={(ev) => ev.preventDefault()}
				/>
			)}
			{!!propsFromParent.input?.error && (
				<span className="validationError">
					{propsFromParent.input.error}
				</span>
			)}
		</div>
	);
};

export default Input;
