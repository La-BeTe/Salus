import React, { useState } from "react";
import "regenerator-runtime/runtime";

function useMyFetch() {
	const [status, setStatus] = useState({ error: "", loading: false });

	async function myFetch(url, body, method) {
		setStatus({ error: "", loading: true });
		try {
			const params = {
				method,
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json"
				}
			};
			if (method !== "GET") params.body = JSON.stringify(body);
			const response = await fetch(url, params);
			const jsonResponse = await response.json();
			if (!jsonResponse.ok) throw jsonResponse.error;
			setStatus({ error: "", loading: false });
			return jsonResponse;
		} catch (e) {
			console.log(e);
			setStatus({
				loading: false,
				error: typeof e === "string" ? e : "Failed to complete request"
			});
			// Throw error so the Promise returned rejects 👎
			throw e;
		}
	}

	function clearError() {
		setStatus({ ...status, error: "" });
	}

	return { status, myFetch, clearError };
}

export default useMyFetch;
