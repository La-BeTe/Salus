const validators = {
    name: function(str){
        if(!str) throw new Error("Name is required.");
		if(typeof str !== "string") throw new Error("Name should be a string.");
        str = str.trim();
		if(str.length < 4) throw new Error("Your name is too short.");
		if(/[^a-zA-Z\s]/.test(str)) throw new Error("Name should only contain letters and spaces.");
		return str;
    },
    password: function(str){
        if(!str) throw new Error("Password is required.");
		if(typeof str !== "string") throw new Error("Password should be a string.");
        str = str.trim();
		if(str.length < 8)
			throw new Error("Password is too short, the minimum length is 8.");
		if(/\s/.test(str))
			throw new Error("Pasword must not contain spaces.");
		if(
			!/\W/.test(str) ||
			!/[a-z]/.test(str) ||
			!/[A-Z]/.test(str)
		)
			throw new Error(
				"Pasword must contain one symbol, one lowercase and one uppercase character."
			);
		return str;
    },
    email: function(str){
        const emailRegExp = /^(\D)+(\w)*((\.(\w)+)?)+@(\D)+(\w)*((\.(\D)+(\w)*)+)?(\.)[a-z]{2,}$/;
		if(!str) throw new Error("Email is required.");
		if(typeof str !== "string") throw new Error("Email should be a string.");
        str = str.trim();
		if(!emailRegExp.test(str))
			throw new Error("Your email is invalid.");
		return str;
    },
    "old-password": function(str){
        // Stringifying here so if no 'old-password' field is passed, we pass an empty string
        // to the controller which would count as a wrong old password
        return String(str || "");
    },
    "confirm-password": function(str, reqBody){
        if(reqBody?.password && (str !== reqBody.password))
            throw new Error("Password and Confirm Password fields must be thesame.");
        return str;
    },
}

export default validators