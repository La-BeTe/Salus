import React, { useState, useEffect } from "react";

const Error = ({ error, clearInfo, info }) => {
	const [hidden, setHidden] = useState(false);
	useEffect(() => {
		setHidden(false);
	}, [info]);
	function hide() {
		setHidden(true);
		clearInfo && clearInfo();
	}
	return (
		<div
			id={error ? "Error" : ""}
			className={hidden ? "Info hide" : "Info"}
		>
			<p>
				{info.split("\n").map((str, i) => (
					<span key={i}>{str}</span>
				))}
			</p>
			<span onClick={hide}>Close</span>
		</div>
	);
};

export default Error;
