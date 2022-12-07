import validators from "../../shared/validators.mjs";

export const payloadNormalizer = function(payload){
    if(payload && (typeof payload === "object")){
        const result = {};
        for(let key in payload){
            result[key] = payload[key]?.value || payload[key];
        }
        return result;
    }
    return payload;
}

export const validator = async function(name, value, inputsObj) {
    inputsObj = payloadNormalizer(inputsObj);
    const validatorFn = validators[name];
	if(validatorFn){
		try{
			await validatorFn.call(validators, value, inputsObj);
			return "";
		}catch(err){
			return err.message;
		}
	}
}