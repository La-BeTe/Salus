import { useState } from "react";

import { payloadNormalizer } from "../utils";

function useFetch() {
	const [isLoading, setIsLoading] = useState(false);

	async function _fetch(url, body, method){
		let jsonResponse;
		setIsLoading(true);
		try {
			const params = {
				method,
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json"
				}
			};
			if(method !== "GET") params.body = JSON.stringify(payloadNormalizer(body));
			const response = await fetch(url, params);
			jsonResponse = await response.json();
			if(!jsonResponse?.ok) throw new Error(jsonResponse?.error);
		}catch(err){
			console.log(err);
			jsonResponse = {
				ok: false,
				error: err?.message || "Failed to complete request."
			}
		}
		setIsLoading(false);
		return jsonResponse;
	}

	return [ isLoading, _fetch ];
}

export default useFetch;
