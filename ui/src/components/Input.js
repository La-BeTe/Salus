import React, { useState, useRef, useEffect } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FontAwesome } from "@fortawesome/react-fontawesome";

// propsFromParent is the original props from parent containing props
// that should not be passed to the DOM
// But props which is derived from propsFromParent is passed directly to the DOM
// so unallowed DOM attributes are removed from props but not propsFromParent
const Input = (propsFromParent) => {
	const inputRef = useRef(null);
	const [cursor, setCursor] = useState(null);
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		const input = inputRef.current;
		if(input && cursor) input.setSelectionRange(cursor, cursor);
	 }, [inputRef, cursor, propsFromParent.input?.value]);

	async function handleInputChange(ev){
		setCursor(ev.target?.selectionStart);
		propsFromParent.setRef && propsFromParent.setRef(ev.target.value);
	}

	const props = { 
		...propsFromParent, 
		ref: inputRef,
		onChange: handleInputChange,
		value: propsFromParent.input?.value || "",
	};

	// Deleting props that are not needed in the DOM
	delete props.icon;
	delete props.input;
	delete props.setRef;

	// This prevents the cursor from jumping forward since email inputs
	// don't have the selectionStart attribute
	if(props.type === "email"){
		props.type = "text";
		props.inputMode = "email";
	}

	// Change props.type if initially a password so as to create
	// the ability to switch inputs with type=password from text to password
	if(showPassword && (props.type === "password")){
		props.type = "text";
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

			<input {...props} />

			{(propsFromParent.type === "password") && (
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
