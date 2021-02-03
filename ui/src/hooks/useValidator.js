import { useState, useEffect, useRef } from "react";

function useValidator({ type, name }) {
	const [error, setError] = useState("");
	const [input, setInput] = useState("");
	const isFirstRender = useRef(true);

	function validate(input) {
		switch (type) {
			case "password":
				if (!input) setError("Password is required");
				else if (input.length < 8)
					setError(
						"Your password is too short, the minimum length is 8"
					);
				else if (!/[a-z]/.test(input))
					setError("Password must contain one lowercase character");
				else if (!/[A-Z]/.test(input))
					setError("Password must contain one uppercase character");
				else if (!/\W/.test(input))
					setError("Pasword must contain one symbol");
				else if (/\s/.test(input))
					setError("Pasword must not contain spaces");
				else setError("");
				break;
			case "email":
				const emailRegExp = /^(\D)+(\w)*((\.(\w)+)?)+@(\D)+(\w)*((\.(\D)+(\w)*)+)?(\.)[a-z]{2,}$/;
				if (!input) setError("Email is required");
				else if (!emailRegExp.test(input))
					setError("Your email is invalid");
				else setError("");
				break;
			case "text":
				if (name === "name") {
					if (!input) setError("Name is required");
					else if (input.length < 4)
						setError("Your name is too short");
					else if (/[^a-zA-Z\s]/.test(input))
						setError("Name should only contain letters and spaces");
					else setError("");
				}
				break;
		}
	}

	useEffect(() => {
		// if (input) {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		} else validate(input);
		// }
	}, [input]);

	return { error, setInput };
}

export default useValidator;
